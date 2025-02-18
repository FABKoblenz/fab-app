import datetime
import os
from collections import defaultdict
from io import BytesIO

from sqlalchemy import func
from starlette.responses import Response
from weasyprint import HTML

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, extract

from connectors import common_deps, CommonDeps
from models.models import FABOrder, FABInvoice, FABUserInfo
from routers.v1.orders import get_order_details

from fastapi.templating import Jinja2Templates

INVOICE_TEMPLATE_BASE_DIR = os.path.dirname(os.path.realpath(__file__)) + "/invoice_template"
templates = Jinja2Templates(directory=INVOICE_TEMPLATE_BASE_DIR)

router = APIRouter()


def generate_invoice(user_id: str, year: int, month: int, commons: CommonDeps) -> BytesIO:
    """
    This kind of does too much - I don't like all of this of what's going on here :/

    @param user_id: The user for which to generate the invoice for
    @param year: The year of the invoice
    @param month: The month of the invoice
    @param commons: The common dependencies -> only used for the db connection

    @return: A BytesIO object containing the PDF of the invoice
    """

    # Get all orders for the user in the given month, ensuring not to include already invoiced orders
    stmt = (
        select(FABOrder)
        .where(
            extract("year", FABOrder.timestamp) == year,
            extract("month", FABOrder.timestamp) == month,
            FABOrder.user_id == user_id,
            FABOrder.fk_invoice is None,
        )
        .order_by(FABOrder.timestamp.asc())
    )
    result = commons.db.exec(stmt)
    all_orders = [r for r in result]

    all_order_details = [get_order_details(order.pk, commons) for order in all_orders]

    if len(all_order_details) == 0:
        raise ValueError(f"No orders found for User: {user_id} (Year-Month) {year}-{month}")

    # Start the invoice numbers with 20251000 and count up from there.
    # It is important to have a closed circle of invoice numbers for the year.
    invoice_number = int(datetime.datetime.now().year) * 10000 + 1000

    max_invoice_stmt = select(func.max(FABInvoice.invoice_number)).where(
        FABInvoice.invoice_number < int(datetime.datetime.now().year + 1) * 10000,
        FABInvoice.invoice_number > invoice_number,
    )
    max_invoice = commons.db.exec(max_invoice_stmt).first()

    if max_invoice:
        invoice_number = max_invoice + 1
    else:
        invoice_number = invoice_number + 1

    now = datetime.datetime.now()
    invoice_date = now.strftime("%d.%m.%Y")

    total = 0
    tax_rate_totals = defaultdict(float)

    for order in all_order_details:
        total += order.total_price
        for item in order.items:
            tax_rate_totals[item.tax_rate] += round((item.total / (1 + item.tax_rate / 100)) * (item.tax_rate / 100), 2)

    user_stmt = select(FABUserInfo).where(FABUserInfo.user_id == user_id)
    user: FABUserInfo = commons.db.exec(user_stmt).first()

    # @TODO grab the user data from the user table
    data = {
        "user": user,
        "invoice_date": invoice_date,
        "invoice_number": invoice_number,
        "all_orders": all_order_details,
        "tax_rate_totals": tax_rate_totals,
        "total": total,
    }

    result = templates.get_template(name="invoice.html").render(**data)

    # Save the invoice to the database
    db_invoice = FABInvoice(invoice_number=invoice_number, invoice_date=now, invoice_html=result)
    commons.db.add(db_invoice)
    commons.db.commit()
    commons.db.refresh(db_invoice)

    # Update the orders with the reference to the invoice
    for order in all_orders:
        order.fk_invoice = db_invoice.pk
        commons.db.add(order)
    commons.db.commit()

    return create_invoice_pdf_from_html(result)


def create_invoice_pdf_from_html(html: str) -> BytesIO:
    """
    Create a PDF from the given HTML string

    @param html: The HTML string to convert to a PDF

    @return: A BytesIO object containing the PDF
    """
    f = BytesIO()
    HTML(string=html, base_url=INVOICE_TEMPLATE_BASE_DIR).write_pdf(f)
    return f


@router.get("/")
def get_invoice(invoice_number: int, commons: CommonDeps = Depends(common_deps)) -> Response:
    stmt = select(FABInvoice).where(FABInvoice.invoice_number == invoice_number)
    result = commons.db.exec(stmt).first()
    f = create_invoice_pdf_from_html(result.invoice_html)
    all_bytes = f.getvalue()
    f.close()
    headers = {"Content-Disposition": 'attachment; filename="out.pdf"'}
    return Response(all_bytes, headers=headers, media_type="application/pdf")


@router.post("/generate")
def generate_invoice_per_year_month_user(
    year: int, month: int, user_id: str, commons: CommonDeps = Depends(common_deps)
):
    try:
        f = generate_invoice(user_id, year, month, commons)
        all_bytes = f.getvalue()
        f.close()
        headers = {"Content-Disposition": 'attachment; filename="out.pdf"'}
        return Response(all_bytes, headers=headers, media_type="application/pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
