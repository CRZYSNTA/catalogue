from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import Response
from services.supabase_service import SupabaseService
import csv
import json
import io
import openpyxl

router = APIRouter()

@router.get("/csv")
def export_csv(x_user_id: str = Header(...)):
    products = SupabaseService.get_all_products(x_user_id)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")

    output = io.StringIO()
    keys = products[0].keys()
    writer = csv.DictWriter(output, fieldnames=keys)
    writer.writeheader()
    writer.writerows(products)
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products.csv"}
    )

@router.get("/json")
def export_json(x_user_id: str = Header(...)):
    products = SupabaseService.get_all_products(x_user_id)
    return Response(
        content=json.dumps(products, default=str),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=products.json"}
    )

@router.get("/excel")
def export_excel(x_user_id: str = Header(...)):
    products = SupabaseService.get_all_products(x_user_id)
    
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Products"

    if products:
        keys = list(products[0].keys())
        ws.append(keys)
        for p in products:
            row = [str(p.get(k, "")) if isinstance(p.get(k), (list, dict)) else p.get(k) for k in keys]
            ws.append(row)
            
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=products.xlsx"}
    )
