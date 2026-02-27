import type { Medication, MedicationSlot } from './DataContext';

export function addMedicationReducer(
  medications: Medication[],
  payload: { id: string; name: string; dose: string; frequency: string; slots: MedicationSlot[]; createdAt: string },
) {
  return [{ ...payload, takenSlotKeys: [] }, ...medications];
}

export function toggleMedicationTakenReducer(
  medications: Medication[],
  payload: { id: string; slot: MedicationSlot; day: string },
) {
  const key = `${payload.day}|${payload.slot}`;
  return medications.map(m => {
    if (m.id !== payload.id) return m;
    const has = m.takenSlotKeys.includes(key);
    return { ...m, takenSlotKeys: has ? m.takenSlotKeys.filter(x => x !== key) : [...m.takenSlotKeys, key] };
  });
}
