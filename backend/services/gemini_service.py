import httpx
import json
from google import genai
from google.genai import types
from config import settings
from models.product import AnalysisResponse
from fastapi import HTTPException
import time

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    @staticmethod
    def _download_image(url: str) -> bytes:
        try:
            response = httpx.get(url, timeout=30.0)
            response.raise_for_status()
            return response.content
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to download image from URL: {str(e)}")

    @staticmethod
    def _parse_json_response(text: str) -> dict:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            raise Exception("Failed to parse JSON from model response")

    @staticmethod
    def analyze_image(image_url_or_bytes: str | bytes) -> AnalysisResponse:
        """Analyzes an image using Gemini and returns structured data."""
        if isinstance(image_url_or_bytes, str):
            image_bytes = GeminiService._download_image(image_url_or_bytes)
        else:
            image_bytes = image_url_or_bytes

        prompt = (
            "You are an expert ecommerce catalogue specialist. Analyse the uploaded product image. "
            "Return ONLY valid JSON (no markdown fences). Extract: product_name, short_title, category, "
            "subcategory, description, materials (array), colors (array), pattern, style, shape, finish, "
            "target_audience (array), features (array), benefits (array), use_cases (array), "
            "selling_points (array), seo_keywords (array), tags (array), price_min (number in INR), "
            "price_max (number in INR), confidence (number 0-1). Do not hallucinate. If something cannot be determined return null."
        )

        part = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-flash-latest",
                    contents=[part, prompt]
                )
                if response.text:
                    parsed = GeminiService._parse_json_response(response.text)
                    return AnalysisResponse(**parsed)
            except Exception as e:
                if attempt == 2:
                    raise HTTPException(status_code=500, detail=f"Gemini analysis failed after 3 attempts: {str(e)}")
                time.sleep(2)
        raise HTTPException(status_code=500, detail="Failed to analyze image")

    @staticmethod
    def regenerate_field(image_url: str, field_name: str) -> str | list | float | None:
        """Regenerates a specific field for an image."""
        image_bytes = GeminiService._download_image(image_url)
        prompt = (
            f"You are an expert ecommerce catalogue specialist. Analyse the uploaded product image. "
            f"Focus on the '{field_name}' property. Return ONLY valid JSON (no markdown fences) with a single key '{field_name}' "
            f"containing the newly generated value for this field."
        )
        part = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-flash-latest",
                    contents=[part, prompt]
                )
                if response.text:
                    parsed = GeminiService._parse_json_response(response.text)
                    return parsed.get(field_name)
            except Exception as e:
                if attempt == 2:
                    raise HTTPException(status_code=500, detail=f"Gemini regeneration failed: {str(e)}")
                time.sleep(2)
        return None
