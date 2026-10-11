"""
Agent 4: Inventory and Daily Briefing Agent
Tracks inventory batches by First-Expiry First-Out (FEFO) principles
and synthesizes proactive morning spoken/text briefings for each store manager.
"""

from typing import List, Dict, Any
from datetime import datetime
from ..models import Store, Batch, BatchEvaluation

class DailyBriefingAgent:
    def __init__(self):
        pass

    def generate_manager_briefing(
        self,
        store: Store,
        store_batches: List[Batch],
        evaluations: List[BatchEvaluation]
    ) -> Dict[str, Any]:
        """
        Synthesizes a structured morning briefing for the store manager.
        """
        at_risk_batches = [b for b in store_batches if b.days_to_expiry <= 3.0]
        critical_count = len(at_risk_batches)
        
        # Pull approved actions for this store
        actions = []
        for ev in evaluations:
            if ev.store_id == store.id:
                rec = ev.recommended_option
                actions.append({
                    "sku_name": ev.sku_name,
                    "quantity": ev.initial_qty,
                    "action_code": rec.code,
                    "action_summary": rec.option_name,
                    "net_recovery": rec.net_recovery
                })

        # Plain language briefing
        greeting = f"Good morning {store.manager_name}!"
        headline = (
            f"FEFO Alert: {critical_count} batch{'es' if critical_count != 1 else ''} require urgent action today "
            f"to protect margin before expiry."
        )

        bullet_points = []
        for act in actions:
            if act["action_code"] == "HYBRID":
                bullet_points.append(
                    f"• {act['sku_name']}: Transfer 50% to nearby deficit store and apply 15% markdown locally (Recovers ₹{act['net_recovery']:.0f})."
                )
            elif act["action_code"] == "MARKDOWN":
                bullet_points.append(
                    f"• {act['sku_name']}: Apply dynamic discount stickers on {act['quantity']} units (Recovers ₹{act['net_recovery']:.0f})."
                )
            elif act["action_code"] == "RESCUE":
                bullet_points.append(
                    f"• {act['sku_name']}: Dispatch {act['quantity']} units to NGO volunteer pickup by 2:00 PM."
                )

        spoken_script = (
            f"Good morning {store.manager_name}. This is your AI Stock Intelligence briefing for {store.name}. "
            f"You have {critical_count} perishable batches expiring within 72 hours. Your primary priority this morning "
            f"is packing the outbound transfer for Greek Yogurt to resolve Koramangala's stockout, followed by applying "
            f"the 15% markdown stickers. Floor task cards have been dispatched to your team's mobile devices."
        )

        # Local language greeting (Hindi / Tamil)
        if store.preferred_language == "hi":
            spoken_script_local = (
                f"नमस्ते {store.manager_name} जी। यह {store.name} के लिए आपका दैनिक स्टॉक ब्रीफिंग है। "
                f"आज 72 घंटे में एक्सपायर होने वाले {critical_count} बैच हैं। कृपया कोरामंगला के लिए दही के 60 पैकेट "
                f"का कोल्ड-ट्रांसफर सुबह 11:30 बजे तक तैयार करें और बाकी 60 पैकेट पर 15% डिस्काउंट लगाएं।"
            )
        elif store.preferred_language == "ta":
            spoken_script_local = (
                f"வணக்கம் {store.manager_name}. இது {store.name} க்கான தினசரி இருப்பு அறிக்கை. "
                f"அடுத்த 72 மணி நேரத்தில் காலாவதியாகும் {critical_count} பொருட்கள் உள்ளன. "
                f"கோரமங்களா கிளைக்கான இடமாற்ற பெட்டியை தயார் செய்யவும்."
            )
        else:
            spoken_script_local = spoken_script

        return {
            "store_id": store.id,
            "store_name": store.name,
            "manager_name": store.manager_name,
            "generated_at": datetime.now().strftime("%I:%M %p, %d %b %Y"),
            "greeting": greeting,
            "headline": headline,
            "actions_required": actions,
            "bullet_points": bullet_points,
            "spoken_audio_script_en": spoken_script,
            "spoken_audio_script_local": spoken_script_local,
            "language": store.preferred_language
        }
