


export const extractErrorMessage = (err) => {
  if (Array.isArray(err?.errors)) {
    const errorMessages = err.errors.map((e) => e.msg); // ดึงเฉพาะข้อความ 'msg' ออกมา
    
    // ใช้ Set เพื่อกรองข้อความที่ซ้ำซ้อน
    const uniqueErrorMessages = [...new Set(errorMessages)]; 
    
    // กรองค่าที่เป็น null, undefined หรือ string ว่างออกไป เพื่อความสะอาดของข้อความ
    const filteredUniqueMessages = uniqueErrorMessages.filter(msg => msg);

    // รวมข้อความที่ไม่ซ้ำกันด้วย " และ "
    return filteredUniqueMessages.join(" และ ");
  }

  // กรณีที่ err มี property message เป็น string
  if (typeof err?.message === 'string') {
    return err.message;
  }
  
  // กรณีที่เป็น error object ทั่วไป หรือไม่มี message ที่ชัดเจน
  return err?.message || "เกิดข้อผิดพลาดบางอย่าง";
};