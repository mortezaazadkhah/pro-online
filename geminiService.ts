
import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { StyleRecommendation } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function virtualTryOn(
  personImageBase64: string,
  clothingImageBase64: string,
  personMimeType: string,
  clothingMimeType: string
): Promise<string> {
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = `
    **ULTIMATE DIRECTIVE: HYPER-REALISTIC VIRTUAL TRY-ON - ZERO ARTIFACT PROTOCOL**

    **Core Mandate:** Your single most important task is to achieve a flawless virtual try-on. The most critical failure, which you must avoid at all costs, is leaving ANY trace, pixel, shadow, or contour of the original clothing from the person's image (Image 1). If this failure occurs, the entire operation is unsuccessful.

    **EXECUTION PROTOCOL (SEQUENTIAL & NON-NEGOTIABLE):**

    **PHASE 0: PRE-PROCESSING & SANITIZATION**
        - **Objective:** Before any other step, you must meticulously inspect both input images (Image 1 and Image 2) for any text overlays, watermarks, brand logos, or copyright notices.
        - **Action:** Inpaint and completely remove any identified text or logos. The background or underlying texture where the text was should be perfectly reconstructed. The output of this phase must be two absolutely clean images to be used in all subsequent phases.

    **PHASE 1: COMPLETE CLOTHING ERADICATION (ABSOLUTE PRIORITY)**
        - **Using the sanitized Image 1 from Phase 0**, execute the total and complete digital removal of all clothing worn by the person.
        - **Zero Tolerance Policy:** There is ZERO tolerance for any remnants. This includes, but is not limited to:
            - Visible fabric or patterns from the original garment.
            - Color bleed from the original clothing onto the skin.
            - Residual shadows cast by the old clothes on the body.
            - Subtle bumps or unnatural contours on the body that suggest underlying clothing.
        - **Mental Model:** Do not think of this as "erasing". You must reconstruct the person's body shape, volume, and skin texture as if the clothing never existed. The output of this phase must be a perfectly clean slate of the human form.

    **PHASE 2: DEEP SCENE & GARMENT ANALYSIS**
        - **Only after Phase 1 is flawlessly complete**, proceed to this phase.
        - **Subject Form:** Analyze the 3D form of the now de-clothed body. Map posture, volume, and curves precisely.
        - **Lighting Environment:** Deconstruct the lighting of the sanitized Image 1. Identify all light sources, their direction, color, and intensity. Map all existing shadows and highlights on the skin.
        - **Garment Physics (Image 2):** Analyze the sanitized garment from Image 2. Reconstruct its material (silk, cotton, denim), texture, patterns ('گل'), and structural features ('چاک لباس') with 100% fidelity. Understand its weight and how it should drape and fold.

    **PHASE 3: PHYSICALLY-BASED INTEGRATION**
        - **Action:** Apply the reconstructed garment from Image 2 onto the clean body slate from Phase 1.
        - **Requirements:**
            - **3D Conformation:** The garment MUST wrap and conform to the body's 3D shape naturally.
            - **Light & Shadow Accuracy:** The new garment must cast physically correct shadows onto the body and receive shadows from the body (e.g., from the chin). The lighting on the fabric must perfectly match the scene's environment.
            - **Seamless Edges:** All edges where the garment meets skin (neckline, sleeves) must be perfectly blended with soft, natural shadowing. NO hard or artificial lines.

    **PHASE 4: FINAL QUALITY CONTROL (SELF-CORRECTION AUDIT)**
        - **Before outputting the final image, perform this mandatory self-audit.**
        - **Question:** "Is there a single pixel, shadow, or artifact from the original clothing visible anywhere in this image?"
        - **Action:** If the answer is YES, you have failed the core mandate. Discard the current attempt and restart the entire process from Phase 1.
        - **Output Condition:** Only generate the final image if the answer to the audit question is an absolute NO.

    **Final Constraint:** Preserve the subject's identity, face, hair, visible skin, and the original background from Image 1 without any modification. The output must be a single, hyper-realistic image.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: personImageBase64,
            mimeType: personMimeType,
          },
        },
        {
          inlineData: {
            data: clothingImageBase64,
            mimeType: clothingMimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.data) {
      return part.inlineData.data;
    }
  }

  throw new Error('No image was generated by the API.');
}


export async function getStyleRecommendations(
  personImageBase64: string,
  personMimeType: string
): Promise<StyleRecommendation[]> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    با توجه به تصویر شخص ارائه شده، فرم بدن، استایل و ویژگی‌های ظاهری او را تحلیل کن.
    ۶ پیشنهاد لباس متمایز و شیک که مناسب او باشد را تولید کن.
    برای هر پیشنهاد، موارد زیر را به زبان فارسی ارائه بده:
    ۱. شرح کاملی از لباس (outfitDescription).
    ۲. نوع مناسبت یا رویدادی که این لباس برای آن مناسب است (occasion) (مثلاً «مهمانی رسمی»، «آخر هفته غیررسمی»، «جلسه کاری»).
    ۳. یک پیشنهاد کفش مشخص که با لباس هماهنگ باشد (shoeSuggestion).
    ۴. نوع عطر یا رایحه‌ای که این استایل را تکمیل می‌کند (perfumeSuggestion) (مثلاً «مرکباتی و تازه»، «چوبی و تند»، «گلی و ملایم»).
    خروجی را حتماً به صورت یک آرایه JSON از اشیاء برگردان و اطمینان حاصل کن که تمام مقادیر رشته‌ای در JSON به زبان فارسی هستند.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: personImageBase64,
            mimeType: personMimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            outfitDescription: {
              type: Type.STRING,
              description: 'شرح کاملی از لباس.',
            },
            occasion: {
              type: Type.STRING,
              description: 'نوع مناسبت یا رویدادی که این لباس برای آن مناسب است.',
            },
            shoeSuggestion: {
              type: Type.STRING,
              description: 'یک پیشنهاد کفش مشخص که با لباس هماهنگ باشد.',
            },
            perfumeSuggestion: {
              type: Type.STRING,
              description: 'نوع عطر یا رایحه‌ای که این استایل را تکمیل می‌کند.',
            },
          },
          required: ['outfitDescription', 'occasion', 'shoeSuggestion', 'perfumeSuggestion'],
        },
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    const recommendations = JSON.parse(jsonStr);
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      return recommendations as StyleRecommendation[];
    }
    throw new Error('Invalid recommendation format received.');
  } catch (e) {
    console.error('Failed to parse style recommendations:', e);
    throw new Error('Could not get style recommendations from the API.');
  }
}
