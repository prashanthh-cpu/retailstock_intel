"""
Agent 0: Orchestrator (Staff Concierge)
Generates localized, human-friendly task execution cards for floor staff in multiple languages
(Hindi, Tamil, Kannada, Spanish, English) with voice/audio prompt readiness.
"""

from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid
from ..models import BatchEvaluation, StaffTask, Store

class OrchestratorConcierge:
    def __init__(self):
        pass

    def create_staff_tasks(self, evaluation: BatchEvaluation, store: Store) -> List[StaffTask]:
        """
        Translates the high-level decision into practical, step-by-step mobile floor tasks.
        """
        tasks = []
        rec = evaluation.recommended_option
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        if rec.code == "HYBRID":
            t_details = rec.breakdown.get("transfer_portion", {})
            m_details = rec.breakdown.get("local_markdown_portion", {})

            # 1. Transfer Task for floor staff
            transfer_task_id = f"TASK_TRF_{uuid.uuid4().hex[:6]}"
            inst_en = (
                f"1. Pull {t_details.get('units', 60)} units of {evaluation.sku_name} from Chiller A.\n"
                f"2. Pack into Blue Insulated Cold-Crate #4 with two gel ice packs.\n"
                f"3. Affix QR transfer tag for {t_details.get('destination_store', 'Store B')}.\n"
                f"4. Hand over to electric van driver by 11:30 AM."
            )
            inst_hi = (
                f"1. चिल्लर A से {evaluation.sku_name} के {t_details.get('units', 60)} पैकेट निकालें।\n"
                f"2. नीले कोल्ड-क्रेट #4 में दो आइस जेल पैक के साथ सुरक्षित पैक करें।\n"
                f"3. {t_details.get('destination_store', 'Store B')} का ट्रांसफर क्यूआर टैग लगाएं।\n"
                f"4. सुबह 11:30 बजे तक डिलीवरी ड्राइवर को सौंपें।"
            )
            inst_ta = (
                f"1. சில்லர் A-விலிருந்து {t_details.get('units', 60)} {evaluation.sku_name} பாக்கெட்டுகளை எடுக்கவும்.\n"
                f"2. நீல நிற குளிர் பெட்டி #4 இல் ஐஸ் பேக்குகளுடன் பேக் செய்யவும்.\n"
                f"3. {t_details.get('destination_store', 'Store B')} க்கான QR லேபிளை ஒட்டவும்.\n"
                f"4. காலை 11:30 மணிக்குள் வேன் ஓட்டுநரிடம் ஒப்படைக்கவும்."
            )

            tasks.append(StaffTask(
                id=transfer_task_id,
                batch_id=evaluation.batch_id,
                store_id=store.id,
                store_name=store.name,
                action_type="TRANSFER_PACK",
                title=f"Pack {t_details.get('units', 60)} units for Inter-Store Transfer",
                instruction_en=inst_en,
                instruction_local=inst_hi if store.preferred_language == "hi" else (inst_ta if store.preferred_language == "ta" else inst_en),
                language=store.preferred_language,
                units=t_details.get("units", 60),
                urgency="CRITICAL",
                deadline="Today by 11:30 AM",
                status="pending",
                created_at=now_str
            ))

            # 2. Markdown Sticker Task for floor staff
            markdown_task_id = f"TASK_MKD_{uuid.uuid4().hex[:6]}"
            inst_en_m = (
                f"1. Print {m_details.get('units', 60)} yellow discount stickers (-15% / ₹{m_details.get('discounted_price', 102):.0f}).\n"
                f"2. Apply sticker over regular barcode on remaining {m_details.get('units', 60)} units.\n"
                f"3. Shift stock to 'Today's Fresh Picks' eye-level shelf in Dairy aisle."
            )
            inst_hi_m = (
                f"1. {m_details.get('units', 60)} पीले डिस्काउंट स्टिकर (-15% / ₹{m_details.get('discounted_price', 102):.0f}) प्रिंट करें।\n"
                f"2. बाकी बचे {m_details.get('units', 60)} पैकेटों के बारकोड पर यह स्टिकर लगाएं।\n"
                f"3. डेयरी रैक के 'टुडे स्पेशल' मुख्य काउंटर पर आगे सजाएं।"
            )
            inst_ta_m = (
                f"1. {m_details.get('units', 60)} மஞ்சள் நிற தள்ளுபடி லேபிள்களை (-15% / ₹{m_details.get('discounted_price', 102):.0f}) அச்சிடவும்.\n"
                f"2. மீதமுள்ள {m_details.get('units', 60)} பாக்கெட்டுகளின் மீது ஒட்டவும்.\n"
                f"3. டெய்ரி பிரிவின் 'இன்றைய சிறப்பு சலுகை' ரேக்கில் முன்புறம் வைக்கவும்."
            )

            tasks.append(StaffTask(
                id=markdown_task_id,
                batch_id=evaluation.batch_id,
                store_id=store.id,
                store_name=store.name,
                action_type="MARKDOWN_STICKER",
                title=f"Apply 15% Markdown Stickers ({m_details.get('units', 60)} units)",
                instruction_en=inst_en_m,
                instruction_local=inst_hi_m if store.preferred_language == "hi" else (inst_ta_m if store.preferred_language == "ta" else inst_en_m),
                language=store.preferred_language,
                units=m_details.get("units", 60),
                urgency="HIGH",
                deadline="Today by 12:00 PM",
                status="pending",
                created_at=now_str
            ))

        elif rec.code == "MARKDOWN":
            tasks.append(StaffTask(
                id=f"TASK_MKD_{uuid.uuid4().hex[:6]}",
                batch_id=evaluation.batch_id,
                store_id=store.id,
                store_name=store.name,
                action_type="MARKDOWN_STICKER",
                title=f"Apply Markdown Stickers ({evaluation.initial_qty} units)",
                instruction_en=f"Apply {rec.breakdown.get('discount_pct', 20)}% discount stickers to all {evaluation.initial_qty} units and restock to front promo endcap.",
                instruction_local=f"सभी {evaluation.initial_qty} यूनिट्स पर {rec.breakdown.get('discount_pct', 20)}% छूट का स्टिकर लगाएं और मुख्य शेल्फ पर रखें।",
                language=store.preferred_language,
                units=evaluation.initial_qty,
                urgency="HIGH",
                deadline="Within 2 hours",
                status="pending",
                created_at=now_str
            ))

        elif rec.code == "RESCUE":
            tasks.append(StaffTask(
                id=f"TASK_RSC_{uuid.uuid4().hex[:6]}",
                batch_id=evaluation.batch_id,
                store_id=store.id,
                store_name=store.name,
                action_type="RESCUE_DISPATCH",
                title=f"Surplus Rescue Handover ({evaluation.initial_qty} units)",
                instruction_en=f"Bag {evaluation.initial_qty} units for NGO volunteer pickup. Verify seal integrity and sign handover receipt.",
                instruction_local=f"एनजीओ वॉलंटियर के लिए {evaluation.initial_qty} यूनिट्स पैक करें और रसीद पर हस्ताक्षर करें।",
                language=store.preferred_language,
                units=evaluation.initial_qty,
                urgency="HIGH",
                deadline="Today by 2:00 PM",
                status="pending",
                created_at=now_str
            ))

        return tasks
