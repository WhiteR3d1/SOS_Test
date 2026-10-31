/* ============================================================
   bank.js — GROUPS (คำถามแบบ "ข้อใดใช่/ไม่ใช่") + MCQ (ข้อเขียนมือ)
   ============================================================ */

/* ---------- GROUPS: ใช้สร้างคำถาม "ข้อใดไม่ใช่..." / "ข้อใดเป็น..." ----------
   members = สมาชิกที่ถูกต้อง, foils = ตัวลวงที่ไม่ใช่สมาชิก
   ต้องมี members >= 3 และ foils >= 3 เสมอ                                      */
const GROUPS = [
  {id:'g01', c:1, title:'บทบาทของระบบปฏิบัติการ (Roles of the Operating System)',
   members:['ผู้ตัดสิน (Referee)','นักลวงตา (Illusionist)','กาว (Glue)'],
   foils:['ตัวแปลภาษา (Compiler)','ตัวเชื่อมโยง (Linker)','ตัวแก้จุดบกพร่อง (Debugger)','ตัวจัดเรียงข้อมูล (Defragmenter)']},

  {id:'g02', c:1, title:'เกณฑ์การประเมินระบบปฏิบัติการ (OS Evaluation)',
   members:['ความน่าเชื่อถือและความพร้อมใช้งาน (Reliability & Availability)','ความปลอดภัย (Security)','การพกพา (Portability)','ประสิทธิภาพ (Performance)','การรับเป็นบุตรบุญธรรม (Adoption)'],
   foils:['ขนาดของซอร์สโค้ด (Lines of Code)','ราคาของฮาร์ดแวร์ (Hardware Price)','ความสวยงามของไอคอน (Icon Aesthetics)','จำนวนภาษาที่รองรับ (Localization Count)']},

  {id:'g03', c:1, title:'ตัววัดด้านประสิทธิภาพ (Performance) ของระบบปฏิบัติการ',
   members:['เวลาตอบสนอง (Response time / Latency)','ปริมาณงาน (Throughput)','ค่าใช้จ่ายส่วนเกิน (Overhead)','ความเป็นธรรม (Fairness)','ความสามารถในการคาดการณ์ (Predictability)'],
   foils:['ความเข้ากันได้ย้อนหลัง (Backward compatibility)','ระดับการเข้ารหัส (Encryption strength)','จำนวนผู้ใช้ที่ลงทะเบียน (Registered users)','ขนาดของเคอร์เนล (Kernel size)']},

  {id:'g04', c:1, title:'ความท้าทาย (Challenges) ของระบบปฏิบัติการตามสไลป์',
   members:['Reliability','Availability','Security','Privacy','Portability','Performance'],
   foils:['Compilation','Visualization','Serialization','Normalization']},

  {id:'g05', c:1, title:'ระบบปฏิบัติการในปัจจุบัน (Today’s Operating Systems) ใช้กับอุปกรณ์ใด',
   members:['สมาร์ทโฟน','ระบบสมองกลฝังตัว','แล็ปท็อปและแท็บเล็ต','เครื่องเสมือน','เซิร์ฟเวอร์ศูนย์ข้อมูล'],
   foils:['เครื่องคิดเลขแบบเฟือง','ลูกคิด','เครื่องพิมพ์ดีดกล','สไลด์รูล']},

  {id:'g06', c:2, title:'กลไกฮาร์ดแวร์หลัก (HW mechanism) ที่ใช้ทำ Protection',
   members:['Memory address translation','Dual mode operation'],
   foils:['Garbage collection','Just-in-time compilation','Dynamic linking','Instruction prefetching','Branch prediction'],
   minMembers:2},

  {id:'g07', c:2, title:'เหตุผลที่ต้องมี Protection ในระบบปฏิบัติการ',
   members:['Reliability: โปรแกรมที่มีบั๊กทำร้ายได้แค่ตัวเอง','Security and privacy: ไว้ใจโปรแกรมให้น้อยลง','Fairness: บังคับส่วนแบ่งของดิสก์และซีพียู'],
   foils:['Compression: ลดขนาดไฟล์ที่เก็บ','Rendering: เร่งความเร็วการแสดงผลกราฟิก','Indexing: ทำให้ค้นหาไฟล์ได้เร็วขึ้น','Localization: รองรับหลายภาษา']},

  {id:'g08', c:2, title:'การเปลี่ยนจาก User mode ไป Kernel mode เกิดจากอะไรได้บ้าง',
   members:['Interrupt','Exception','System call'],
   foils:['Function call ภายในโปรแกรมเดียวกัน','การประกาศตัวแปร','การคำนวณเลขคณิต','การวนลูป while']},

  {id:'g09', c:2, title:'การเปลี่ยนจาก Kernel mode ไป User mode เกิดจากอะไรได้บ้าง',
   members:['การเริ่มโปรเซส/เธรดใหม่','การ return จาก interrupt, exception หรือ system call','Process/thread context switch','User-level upcall (UNIX signal)'],
   foils:['การเกิด timer interrupt','การเกิด page fault','การเรียก system call','การเกิด division by zero']},

  {id:'g10', c:2, title:'วิธีการรับ interrupt อย่างปลอดภัย (How do we take interrupts safely?)',
   members:['Interrupt vector','Kernel interrupt stack','Interrupt masking','Atomic transfer of control','Transparent restartable execution'],
   foils:['Virtual memory swapping','Disk defragmentation','Thread pooling','Lock-free hashing']},

  {id:'g11', c:2, title:'สิ่งที่ถูกเปลี่ยนอย่าง atomic เมื่อเกิดการถ่ายโอนการควบคุม (x86 interrupt)',
   members:['Program counter (PC)','Stack pointer (SP)','Memory protection','Kernel/user mode'],
   foils:['ชื่อไฟล์ที่เปิดอยู่','ขนาดของฮีป','ค่า environment variable','หมายเลขพอร์ตเครือข่าย']},

  {id:'g12', c:2, title:'ข้อมูลที่เก็บอยู่ใน PCB (Process Control Block)',
   members:['สถานะ (running, ready, blocked)','รีจิสเตอร์และ SP ตอนที่ไม่ได้รัน','Process ID, ผู้ใช้, ไฟล์ที่รันได้, ลำดับความสำคัญ','เวลาที่ใช้ไปในการทำงาน','พื้นที่หน่วยความจำและตารางแปลที่อยู่'],
   foils:['ซอร์สโค้ดต้นฉบับของโปรแกรม','ประวัติการแก้ไขไฟล์ (Git log)','รหัสผ่านของผู้ใช้แบบ plaintext','แผนผังวงจรของซีพียู']},

  {id:'g13', c:2, title:'สิ่งที่ Kernel System Call Handler ต้องทำ',
   members:['Vector ผ่านจุดเข้าของ syscall ที่นิยามไว้ชัดเจน','ระบุตำแหน่งอาร์กิวเมนต์ (Locate arguments)','คัดลอกอาร์กิวเมนต์จากหน่วยความจำผู้ใช้มายังเคอร์เนล','ตรวจสอบความถูกต้องของอาร์กิวเมนต์ (Validate)','คัดลอกผลลัพธ์กลับไปยังหน่วยความจำผู้ใช้'],
   foils:['คอมไพล์โค้ดของผู้ใช้ใหม่','เข้ารหัสฮาร์ดดิสก์ทั้งลูก','เรียงลำดับไฟล์ในไดเรกทอรี','อัปเดตไดรเวอร์อัตโนมัติ']},

  {id:'g14', c:2, title:'เป้าหมายของ Process VM',
   members:['ให้การแยกตัว (Isolation) แก่โปรแกรม','กั้นขอบเขตการใช้หน่วยความจำ','แยกความผิดพลาด (Fault isolation) ไม่ให้บั๊กทำให้เครื่องพัง','ทำให้โปรแกรมพกพาได้ โดยเขียนให้ OS แทนที่จะเขียนให้ HW'],
   foils:['เพิ่มความเร็วสัญญาณนาฬิกาของซีพียู','บีบอัดไฟล์อัตโนมัติ','เพิ่มขนาดของ RAM ทางกายภาพ','ลดจำนวนคอร์ที่ต้องใช้']},

  {id:'g15', c:2, title:'สถานะที่โปรแกรมผู้ใช้อาจเป็นตัวก่อปัญหาซึ่งเคอร์เนลต้องรับมือ',
   members:['Syscall ที่ส่ง null pointer มา','คำสั่ง return ที่อยู่นอกขอบเขต','User stack pointer ที่อยู่นอกขอบเขต'],
   foils:['การใช้ตัวแปรชื่อยาวเกินไป','การเขียนคอมเมนต์เป็นภาษาไทย','การตั้งชื่อฟังก์ชันซ้ำกัน','การใช้ indent ไม่สม่ำเสมอ']},

  {id:'g16', c:3, title:'System call ของ UNIX สำหรับจัดการโปรเซส',
   members:['fork','exec','wait','signal'],
   foils:['malloc','printf','strlen','qsort']},

  {id:'g17', c:3, title:'System call ของ UNIX สำหรับการทำ I/O',
   members:['open','read','write','close'],
   foils:['fork','exec','wait','pipe']},

  {id:'g18', c:3, title:'หลักการของ UNIX I/O',
   members:['Uniformity','Open before use','Byte-oriented','Kernel-buffered read/write','Explicit close'],
   foils:['Record-oriented','Direct hardware access','Automatic garbage collection','Mandatory encryption']},

  {id:'g19', c:3, title:'รูปแบบการสื่อสารระหว่างโปรเซส (Interprocess Communication)',
   members:['Producer-consumer','Client-server','File system'],
   foils:['Context switch','Page fault','Interrupt masking','Address translation']},

  {id:'g20', c:3, title:'ขั้นตอนของ Windows CreateProcess',
   members:['สร้างและกำหนดค่าเริ่มต้นให้ PCB ในเคอร์เนล','สร้างและกำหนดค่าเริ่มต้นให้ address space ใหม่','โหลดโปรแกรมเข้า address space','คัดลอกอาร์กิวเมนต์เข้าหน่วยความจำใน address space','กำหนดค่าเริ่มต้นให้ hardware context เพื่อเริ่มที่ start','แจ้ง scheduler ว่าโปรเซสใหม่พร้อมรันแล้ว'],
   foils:['คอมไพล์ซอร์สโค้ดของโปรแกรม','ดาวน์โหลดโปรแกรมจากอินเทอร์เน็ต','ลบโปรเซสเดิมออกจากดิสก์','สร้างบัญชีผู้ใช้ใหม่']},

  {id:'g21', c:3, title:'ขั้นตอนของการ implement UNIX fork',
   members:['สร้างและกำหนดค่าเริ่มต้นให้ PCB ในเคอร์เนล','สร้าง address space ใหม่','กำหนดค่าเริ่มต้นให้ address space ด้วยสำเนาของเนื้อหาทั้งหมดจากพาเรนต์','สืบทอด execution context ของพาเรนต์ เช่น ไฟล์ที่เปิดอยู่','แจ้ง scheduler ว่าโปรเซสใหม่พร้อมรันแล้ว'],
   foils:['โหลดโปรแกรมใหม่เข้า address space ปัจจุบัน','ลบ address space ของพาเรนต์ทิ้ง','เปลี่ยนชื่อโปรแกรมที่กำลังรัน','ปิด file descriptor ทั้งหมดของพาเรนต์']},

  {id:'g22', c:3, title:'ขั้นตอนของการ implement UNIX exec',
   members:['โหลดโปรแกรมเข้า address space ปัจจุบัน','คัดลอกอาร์กิวเมนต์เข้าหน่วยความจำใน address space','กำหนดค่าเริ่มต้นให้ hardware context เพื่อเริ่มที่ start'],
   foils:['สร้าง address space ใหม่ทั้งหมด','สร้าง PCB ใหม่ในเคอร์เนล','คัดลอกเนื้อหาของพาเรนต์ทั้งหมด','สร้าง PID ใหม่ให้โปรเซส']},

  {id:'g23', c:3, title:'ข้อดีของ Microkernel',
   members:['ปรับเปลี่ยนง่ายโดยไม่ต้องแก้ไข Kernel','คล่องตัวกว่า','ระบบขัดข้องได้น้อยกว่า Monolithic Kernel','มีขนาดเล็ก เหมาะกับฮาร์ดแวร์ขนาดเล็ก'],
   foils:['ทำงานเร็วกว่า','ดำเนินการจบในตัวมันเอง','ไม่ต้องทำ context switch สำหรับ driver','มีขนาดใหญ่']},

  {id:'g24', c:3, title:'ข้อดีของ Monolithic kernel',
   members:['เร็วกว่า','ดำเนินการจบในตัวมันเอง','โครงสร้างไม่ซับซ้อนและเรียบง่าย'],
   foils:['ปรับเปลี่ยนง่ายโดยไม่ต้องแก้ไข Kernel','มีขนาดเล็ก เหมาะกับฮาร์ดแวร์ขนาดเล็ก','ระบบขัดข้องได้น้อยกว่า','บริการพังหนึ่งตัวไม่กระทบระบบ']},

  {id:'g25', c:4, title:'เหตุผลที่ต้องมี Concurrency (Why Concurrency?)',
   members:['เซิร์ฟเวอร์: รองรับหลายการเชื่อมต่อพร้อมกัน','โปรแกรมแบบขนาน: เพื่อประสิทธิภาพที่ดีขึ้น','โปรแกรมที่มีอินเทอร์เฟซผู้ใช้: เพื่อการตอบสนองที่ดีขณะคำนวณ','โปรแกรมที่ติดเครือข่ายและดิสก์: เพื่อซ่อน latency'],
   foils:['เพื่อลดขนาดไฟล์ปฏิบัติการ','เพื่อทำให้โค้ดอ่านง่ายขึ้น','เพื่อประหยัดพื้นที่ดิสก์','เพื่อหลีกเลี่ยงการใช้คอมไพเลอร์']},

  {id:'g26', c:4, title:'การดำเนินการกับเธรด (Thread Operations)',
   members:['thread_create','thread_yield','thread_join','thread_exit'],
   foils:['thread_compile','thread_encrypt','thread_sort','thread_render']},

  {id:'g27', c:4, title:'สถานะใน Thread Lifecycle',
   members:['Init','Ready','Running','Waiting','Finished'],
   foils:['Compiled','Linked','Cached','Swapped']},

  {id:'g28', c:4, title:'สถานะที่เธรดในโปรเซสเดียวกันใช้ร่วมกัน (Shared State)',
   members:['Code','Global Variables','Heap'],
   foils:['Stack','Thread Control Block','Saved Registers','Thread Metadata']},

  {id:'g29', c:4, title:'สถานะที่เป็นของเธรดแต่ละตัวโดยเฉพาะ (Per-Thread State)',
   members:['Stack','Thread Control Block (TCB)','Saved Registers','Thread Metadata'],
   foils:['Code','Global Variables','Heap','Static Data ที่แชร์กัน']},

  {id:'g30', c:4, title:'ขั้นตอนของ Thread_fork(func, args)',
   members:['จัดสรร thread control block','จัดสรรสแต็ก','สร้าง stack frame สำหรับฐานของสแต็ก (stub)','วาง func และ args ลงบนสแต็ก','ใส่เธรดลงใน ready list'],
   foils:['เรียก thread_exit ทันที','ลบสแต็กของพาเรนต์','ปิด interrupt ถาวร','สร้าง address space ใหม่']},

  {id:'g31', c:4, title:'ขั้นตอนของ Voluntary thread context switch',
   members:['บันทึกรีจิสเตอร์ลงบนสแต็กเดิม','สลับไปยังสแต็กใหม่ของเธรดใหม่','กู้คืนรีจิสเตอร์จากสแต็กใหม่','return'],
   foils:['ล้าง TLB ทั้งหมด','เขียนหน้าที่ dirty กลับลงดิสก์','เพิ่มลำดับความสำคัญของเธรด','สร้าง PCB ใหม่']},

  {id:'g32', c:5, title:'สาเหตุที่ทำให้พฤติกรรมของโปรแกรมที่ทำงานพร้อมกันไม่แน่นอน',
   members:['ตารางเวลาของเธรดเป็นแบบ non-deterministic','คอมไพเลอร์และฮาร์ดแวร์สลับลำดับคำสั่ง','การดำเนินการแบบหลายคำไม่เป็น atomic','เธรดเขียนตัวแปรเดียวกันพร้อมกัน'],
   foils:['โปรแกรมถูกคอมไพล์ด้วย -O0','ตัวแปรถูกประกาศเป็น const','โค้ดมีคอมเมนต์น้อยเกินไป','ไฟล์ซอร์สมีขนาดใหญ่']},

  {id:'g33', c:5, title:'คุณสมบัติที่ Lock ที่ถูกต้องต้องรับประกัน',
   members:['มีผู้ถือ lock ได้มากที่สุดหนึ่งรายในแต่ละเวลา (safety)','ถ้าไม่มีใครถืออยู่ ผู้ที่ acquire จะได้รับ lock (progress)','ถ้าผู้ถือทั้งหมดทำเสร็จและไม่มีผู้รอที่สำคัญกว่า ผู้รอจะได้ lock ในที่สุด (progress)'],
   foils:['ผู้ถือ lock จะได้ลำดับความสำคัญสูงสุดเสมอ','lock จะถูกปล่อยอัตโนมัติเมื่อหมดเวลา','เธรดอื่นสามารถปล่อย lock แทนได้','lock รับประกันว่าไม่เกิด page fault']},

  {id:'g34', c:5, title:'กฎการใช้งาน Lock (Rules for Using Locks)',
   members:['เริ่มต้น lock ต้องว่าง','ยึด lock ก่อนเข้าถึงโครงสร้างข้อมูลที่ใช้ร่วมกันเสมอ','ปล่อย lock หลังใช้ข้อมูลร่วมเสร็จเสมอ','เฉพาะผู้ถือ lock เท่านั้นที่ปล่อยได้','ห้ามเข้าถึงข้อมูลร่วมโดยไม่มี lock เด็ดขาด'],
   foils:['โยน lock ให้คนอื่นปล่อยแทนได้','ยึด lock ได้หลายรอบโดยไม่ต้องปล่อย','อ่านข้อมูลร่วมโดยไม่ต้อง lock ก็ได้ถ้าอ่านอย่างเดียว','ปล่อย lock ก่อนเข้าถึงข้อมูลร่วม']},

  {id:'g35', c:5, title:'ตัวแปรการซิงโครไนซ์ (Synchronization Variables) ในแผนผัง Roadmap',
   members:['Semaphores','Locks','Condition Variables'],
   foils:['Interrupt Disable','Test-and-Set','Bounded Buffer','Barrier']},

  {id:'g36', c:5, title:'คำสั่ง Atomic Instructions ในแผนผัง Roadmap',
   members:['Interrupt Disable','Test-and-Set'],
   foils:['Semaphores','Locks','Condition Variables','Bounded Buffer','Barrier'],
   minMembers:2},

  {id:'g37', c:6, title:'นโยบายการจัดตารางสำหรับระบบโปรเซสเซอร์เดียว (Uniprocessor policies)',
   members:['FIFO','Round Robin','SJF/SRTF','Multi-level Feedback Queue'],
   foils:['Affinity scheduling','Gang scheduling','Page coloring','Copy-on-write']},

  {id:'g38', c:6, title:'เป้าหมายของ Multi-level Feedback Queue (MFQ)',
   members:['Responsiveness (การตอบสนอง)','Low overhead (ค่าใช้จ่ายส่วนเกินต่ำ)','Starvation freedom (ไม่เกิดการอดอยาก)','รองรับงานที่มีลำดับความสำคัญสูง/ต่ำต่างกัน','Fairness ในหมู่งานที่มีลำดับความสำคัญเท่ากัน'],
   foils:['รับประกันว่าจะไม่มี context switch เลย','ลดการใช้หน่วยความจำให้เหลือศูนย์','ทำให้ทุกงานเสร็จพร้อมกัน','ขจัด page fault ทั้งหมด']},

  {id:'g39', c:7, title:'เป้าหมายของ Address Translation',
   members:['Memory protection','Memory sharing','รองรับ Sparse addresses','Efficiency'],
   foils:['Instruction scheduling','Loop unrolling','Register allocation','Dead code elimination']},

  {id:'g40', c:7, title:'ข้อดีของ Base and Bound',
   members:['เรียบง่าย','เร็ว เพราะใช้แค่ 2 รีจิสเตอร์ ตัวบวก และตัวเปรียบเทียบ','ปลอดภัย','ย้ายตำแหน่งในหน่วยความจำจริงได้โดยไม่ต้องแก้โปรเซส'],
   foils:['แชร์โค้ดกับโปรเซสอื่นได้','ขยายสแต็ก/ฮีปได้ตามต้องการ','ป้องกันโปรแกรมเขียนทับโค้ดตัวเองได้','รองรับ sparse address space']},

  {id:'g41', c:7, title:'ข้อดีของ Segmentation',
   members:['แชร์ segment ของโค้ด/ข้อมูลระหว่างโปรเซสได้','ป้องกัน segment ของโค้ดไม่ให้ถูกเขียนทับได้','ขยายสแต็ก/ฮีปได้อย่างโปร่งใส','ตรวจจับได้ว่าต้องทำ copy-on-write เมื่อใด'],
   foils:['จัดการหน่วยความจำได้ง่าย','ไม่เกิด external fragmentation','ไม่ต้องหาก้อนตามขนาดที่กำหนด','ไม่ต้องจัดเรียงหน่วยความจำใหม่']},

  {id:'g42', c:7, title:'ข้อดีของ Multi-level Translation',
   members:['จัดสรรหน่วยความจำได้มีประสิทธิภาพเมื่อเทียบกับ segment','มีประสิทธิภาพกับ sparse address เมื่อเทียบกับ paging','โอนย้ายดิสก์ได้มีประสิทธิภาพเพราะหน่วยมีขนาดคงที่','สร้าง TLB ได้ง่ายขึ้น','ค้นย้อนกลับจาก physical ไป virtual ได้มีประสิทธิภาพ'],
   foils:['ใช้การค้นหาเพียงครั้งเดียวต่อการอ้างหน่วยความจำ','ไม่มี space overhead เลย','ไม่ต้องใช้ตารางใด ๆ','เร็วกว่า TLB']},

  {id:'g43', c:7, title:'การใช้ประโยชน์จาก Address Translation',
   members:['Process isolation','Interprocess communication ที่มีประสิทธิภาพ','Shared code segments','Program initialization','Dynamic memory allocation','Copy on write','Memory mapped files','Zero-copy I/O','Program debugging ด้วย data breakpoints'],
   foils:['Instruction pipelining','Branch prediction','Cache line prefetching','Out-of-order execution']},

  {id:'g44', c:8, title:'นโยบายการแทนที่หน้า (Cache/Page Replacement Policy)',
   members:['FIFO','MIN','LRU','LFU','Clock'],
   foils:['SJF','Round Robin','Max-Min Fairness','Gang scheduling']},

  {id:'g45', c:8, title:'ข้อดีของ Memory-mapped Files',
   members:['เขียนโปรแกรมง่าย โดยเฉพาะกับไฟล์ขนาดใหญ่','Zero-copy I/O','Pipelining: เริ่มทำงานได้ก่อนที่ทุกหน้าจะถูกเติมครบ','ใช้สื่อสารระหว่างโปรเซสได้'],
   foils:['รับประกันว่าไม่เกิด page fault','ไม่ต้องใช้ตารางหน้า','ทำงานได้โดยไม่ต้องมีดิสก์','ลดขนาดไฟล์โดยอัตโนมัติ']},

  {id:'g46', c:8, title:'เครื่องมือที่ได้จาก Hardware address translation (Kernel trap on read/write)',
   members:['Copy on write','Fill on reference','Demand paged virtual memory','Memory mapped files','Modified bit emulation','Use bit emulation'],
   foils:['Instruction reordering','Register renaming','Speculative execution','Loop fusion']},
];


/* ---------- MCQ: ข้อสอบเชิงวิเคราะห์ที่เขียนมือ ----------
   a = ดัชนีของคำตอบที่ถูกต้องใน ch (โปรแกรมจะสลับตัวเลือกให้เอง)         */
const MCQ = [
  /* ===== บทที่ 1 ===== */
  {id:'b001', c:1, q:'OS ที่ทำให้โปรแกรมรู้สึกว่ามี "จำนวนหน่วยความจำที่ไม่มีที่สิ้นสุด" กำลังทำหน้าที่ในบทบาทใด',
   ch:['นักลวงตา (Illusionist)','ผู้ตัดสิน (Referee)','กาว (Glue)','ตัวจัดตารางเวลา (Scheduler)'], a:0,
   e:'บทบาท Illusionist คือการสร้างภาพลวงตาให้แต่ละแอปเสมือนมีเครื่องทั้งหมดเป็นของตัวเอง ทั้งโปรเซสเซอร์ที่ไม่สิ้นสุดและหน่วยความจำที่ไม่สิ้นสุด ส่วน Referee เน้นจัดสรร/แยก/สื่อสาร และ Glue เน้นไลบรารีและอินเทอร์เฟซร่วม'},

  {id:'b002', c:1, q:'การที่ OS "แยกผู้ใช้และแอปพลิเคชันออกจากกัน" จัดอยู่ในบทบาทใด',
   ch:['ผู้ตัดสิน (Referee)','นักลวงตา (Illusionist)','กาว (Glue)','ตัวโหลดโปรแกรม (Loader)'], a:0,
   e:'Referee มี 3 งานย่อย คือ จัดสรรทรัพยากรระหว่างผู้ใช้/แอป, แยกผู้ใช้และแอปออกจากกัน, และจัดการการสื่อสารระหว่างกัน'},

  {id:'b003', c:1, q:'ตามการออกแบบที่ประนีประนอม (Design Tradeoffs) การ "รักษา API ดั้งเดิมเอาไว้" ส่งผลอย่างไร',
   ch:['การพกพาดีขึ้น แต่ความน่าเชื่อถือและความปลอดภัยลดลง','การพกพาแย่ลง แต่ความปลอดภัยดีขึ้น','ประสิทธิภาพดีขึ้น แต่การพกพาแย่ลง','ไม่มีผลกระทบต่อเกณฑ์ใดเลย'], a:0,
   e:'สไลด์ระบุว่า "รักษา API ดั้งเดิม → พกพา↑, เชื่อถือได้↓, ปลอดภัย↓" ส่วน "ทำลายสิ่งที่เป็นนามธรรม → ประสิทธิภาพ↑, การพกพา↓, ความน่าเชื่อถือ↓"'},

  {id:'b004', c:1, q:'ตามสไลด์ การ "ทำลายสิ่งที่เป็นนามธรรม (abstraction)" ให้ผลลัพธ์ใด',
   ch:['ประสิทธิภาพดีขึ้น แต่การพกพาและความน่าเชื่อถือลดลง','ความปลอดภัยดีขึ้น แต่ประสิทธิภาพลดลง','การพกพาดีขึ้น แต่ประสิทธิภาพลดลง','ทุกเกณฑ์ดีขึ้นพร้อมกัน'], a:0,
   e:'การทะลุชั้นนามธรรมลงไปคุยกับฮาร์ดแวร์ตรง ๆ ทำให้เร็วขึ้น แต่ผูกติดฮาร์ดแวร์จึงพกพายากและเสี่ยงพังง่ายขึ้น'},

  {id:'b005', c:1, q:'ระบบปฏิบัติการยุคแรกแบบ "ครั้งละหนึ่งโปรแกรม" มีลักษณะอย่างไร',
   ch:['OS เป็นเพียงไลบรารีรันไทม์ และผู้ใช้ต้องยืนต่อแถวเพื่อใช้คอมพิวเตอร์','ผู้ใช้หลายคนใช้เครื่องพร้อมกันผ่านเทอร์มินัล','OS โหลดงานถัดไปขณะงานปัจจุบันยังทำงานอยู่','โปรแกรมถูกแบ่งเป็นหน้าและสลับเข้าออกดิสก์'], a:0,
   e:'ยุคแรกสุดโปรแกรมควบคุมฮาร์ดแวร์อย่างสมบูรณ์ OS เป็นไลบรารีรันไทม์ และผู้ใช้ยืนต่อแถวเพื่อใช้คอมพิวเตอร์ ส่วนการโหลดงานถัดไปล่วงหน้าคือ "ระบบแบทช์"'},

  {id:'b006', c:1, q:'เหตุใดระบบแบทช์ (Batch system) จึงถูกคิดค้นขึ้น',
   ch:['เพื่อทำให้ CPU ไม่ว่างด้วยการมีคิวงานรออยู่','เพื่อให้ผู้ใช้โต้ตอบกับโปรแกรมได้แบบเรียลไทม์','เพื่อลดราคาของหน่วยความจำ','เพื่อรองรับการเชื่อมต่อเครือข่าย'], a:0,
   e:'คอมพิวเตอร์ยุคนั้นแพงมาก จึงต้องทำให้ CPU ไม่ว่าง โดย OS จะโหลดงานถัดไปขณะที่งานปัจจุบันกำลังทำงานอยู่ ผู้ใช้ส่งงานแล้วรอผล ยังไม่ใช่การโต้ตอบ'},

  {id:'b007', c:1, q:'ในยุค Time-Sharing OS (คอมพิวเตอร์และผู้คนมีราคาแพง) สิ่งสำคัญที่ต้องปรับให้เหมาะสมคืออะไร',
   ch:['เวลาของผู้ใช้ ไม่ใช่เวลาคอมพิวเตอร์','เวลาคอมพิวเตอร์ ไม่ใช่เวลาผู้ใช้','ขนาดของฮาร์ดดิสก์','จำนวนบรรทัดของซอร์สโค้ด'], a:0,
   e:'สไลด์ระบุว่าเมื่อคอมพิวเตอร์มีราคาถูกลง สิ่งสำคัญคือต้องปรับเวลาของผู้ใช้ให้เหมาะสม ไม่ใช่เวลาคอมพิวเตอร์'},

  {id:'b008', c:1, q:'ตามหัวข้อ Challenges ข้อใดอธิบาย "Portability สำหรับ OS" ได้ถูกต้อง',
   ch:['ใช้ Hardware Abstraction Layer เป็นชั้นอ้างอิงระหว่างผู้ใช้กับฝั่งที่เป็นคนเขียน OS','ใช้ API และ Abstract Virtual Machine เป็นหลัก','ใช้การบีบอัดโค้ดให้เล็กลงเพื่อย้ายง่าย','ใช้การเข้ารหัสไฟล์ปฏิบัติการ'], a:0,
   e:'สไลด์แยกไว้ชัดเจน: สำหรับ "programs" ต้องพิจารณา API และ Abstract Virtual Machine ส่วนสำหรับ "OS" คือ HW abstraction layer'},

  {id:'b009', c:1, q:'ระบบปฏิบัติการในวันพรุ่งนี้ (Tomorrow’s OS) มีแนวโน้มอย่างไรตามสไลด์',
   ch:['ศูนย์ข้อมูลขนาดยักษ์ โปรเซสเซอร์ต่อเครื่องเพิ่มขึ้น คอมพิวเตอร์ต่อผู้ใช้เพิ่มขึ้น และที่เก็บขนาดใหญ่มาก','คอมพิวเตอร์มีราคาแพงขึ้น ผู้ใช้ต้องแบ่งกันใช้มากขึ้น','กลับไปใช้ระบบแบทช์เพื่อประหยัด CPU','เลิกใช้เคอร์เนลและให้แอปคุมฮาร์ดแวร์โดยตรง'], a:0,
   e:'สไลด์ระบุ 4 แนวโน้ม: ศูนย์ข้อมูลขนาดยักษ์, จำนวนโปรเซสเซอร์ต่อคอมพิวเตอร์เพิ่มขึ้น, จำนวนคอมพิวเตอร์ต่อผู้ใช้เพิ่มขึ้น และที่เก็บขนาดใหญ่มาก'},

  {id:'b010', c:1, q:'ข้อใดคือความแตกต่างระหว่าง Reliability กับ Availability',
   ch:['Reliability คือระบบต้องมีความเสถียร ส่วน Availability คือต้องพร้อมใช้งานตลอดเวลา','Reliability คือป้องกันไวรัส ส่วน Availability คือแบ่งแยกไฟล์ของแต่ละคน','ทั้งสองคำมีความหมายเหมือนกันทุกประการ','Reliability คือความเร็ว ส่วน Availability คือปริมาณงาน'], a:0,
   e:'ตามหัวข้อ Challenges: Reliability = ต้องมีความเสถียร, Availability = พร้อมใช้งานตลอดเวลา ส่วนการป้องกันไวรัสคือ Security และการแบ่งแยกไฟล์คือ Privacy'},

  /* ===== บทที่ 2 ===== */
  {id:'b101', c:2, q:'ข้อใดกล่าวถึง Kernel ได้ถูกต้องที่สุด',
   ch:['เป็นส่วนของ OS ที่รันอยู่ตลอดเวลาบนคอมพิวเตอร์ และอยู่ใน RAM','เป็นโปรแกรมที่ถูกโหลดเข้ามาเฉพาะตอนที่มีการเรียก system call','เป็นไลบรารีที่ลิงก์เข้ากับทุกแอปพลิเคชันตอนคอมไพล์','เป็นส่วนของฮาร์ดแวร์ที่ฝังอยู่ในซีพียู'], a:0,
   e:'Kernel คือส่วนแกนกลางของ OS ที่ "running all the time on the computer" อยู่ใน RAM จัดการทรัพยากรระบบ และเป็นสะพานเชื่อมระหว่างแอปกับฮาร์ดแวร์'},

  {id:'b102', c:2, q:'จะเกิดอะไรขึ้นเมื่อโปรแกรมของผู้ใช้พยายามรันคำสั่งที่มีสิทธิ์พิเศษ (privileged instruction)',
   ch:['เกิด exception แล้วสลับเข้าสู่ kernel mode','คำสั่งถูกรันตามปกติแต่ช้าลง','ระบบปฏิบัติการจะเพิ่มสิทธิ์ให้โปรแกรมโดยอัตโนมัติ','คอมพิวเตอร์จะรีสตาร์ททันที'], a:0,
   e:'เมื่อโค้ดใน user mode เรียกคำสั่งที่มีสิทธิ์พิเศษ ฮาร์ดแวร์จะเกิด exception แล้วถ่ายโอนการควบคุมเข้าสู่ kernel ซึ่ง kernel จะตัดสินใจจัดการต่อ'},

  {id:'b103', c:2, q:'เหตุใดตัวจัดการ interrupt จึงไม่สามารถใช้สแต็กของโปรเซสผู้ใช้ที่ถูกขัดจังหวะได้',
   ch:['เพราะโปรแกรมผู้ใช้อาจตั้งค่า user stack ไว้ผิดหรือมุ่งร้าย ทำให้เคอร์เนลพังได้','เพราะ user stack มีขนาดเล็กเกินไปเสมอ','เพราะ user stack ถูกเข้ารหัสไว้','เพราะ user stack อยู่ในดิสก์ไม่ใช่หน่วยความจำ'], a:0,
   e:'สไลด์ระบุว่า "Can’t just use the user stack" เพราะโปรแกรมอาจตั้ง user stack ให้ชี้ผิดที่ ถ้าเคอร์เนลไปเขียนบนนั้นก็จะพังหรือถูกโจมตี จึงต้องใช้ two-stack model แยก kernel stack ออกมา'},

  {id:'b104', c:2, q:'ข้อใดคือความแตกต่างที่ถูกต้องระหว่าง Interrupt กับ Exception',
   ch:['Interrupt เกิดจากเหตุการณ์ในฮาร์ดแวร์ ส่วน Exception เกิดจากพฤติกรรมของโปรแกรมที่ไม่คาดคิดหรือมุ่งร้าย','Interrupt เกิดจากโปรแกรม ส่วน Exception เกิดจากฮาร์ดแวร์','ทั้งสองเกิดจากการเรียก system call เท่านั้น','Interrupt ทำให้เข้าสู่ user mode ส่วน Exception ทำให้เข้าสู่ kernel mode'], a:0,
   e:'Interrupt ถูก trigger โดย timer และอุปกรณ์ I/O ส่วน Exception ถูก trigger โดยพฤติกรรมของโปรแกรมที่ไม่คาดคิด เช่น หารด้วยศูนย์ ทั้งคู่พาเข้าสู่ kernel mode เหมือนกัน'},

  {id:'b105', c:2, q:'Timer interrupt มีไว้เพื่อวัตถุประสงค์ใดเป็นหลัก',
   ch:['เพื่อดึงการควบคุมกลับคืนมาจากโปรแกรมผู้ใช้ที่ติดอยู่ในลูป','เพื่อวัดเวลาที่ใช้ในการคอมไพล์โปรแกรม','เพื่อซิงโครไนซ์นาฬิกาของระบบกับเซิร์ฟเวอร์เวลา','เพื่อเพิ่มความเร็วของการเข้าถึงดิสก์'], a:0,
   e:'สไลด์ระบุว่า Timer มีไว้ "To regain control from a user program in a loop" ถ้าไม่มีตัวจับเวลา โปรแกรมที่วนลูปไม่สิ้นสุดจะยึดซีพียูไว้ตลอดกาล'},

  {id:'b106', c:2, q:'ตามลำดับขั้นของ x86 Interrupt ข้อใดคือสิ่งแรก ๆ ที่ต้องถูกบันทึกไว้',
   ch:['Stack pointer, Program counter และ Processor status word','ชื่อโปรเซสและ PID','เนื้อหาของฮีปทั้งหมด','ตารางหน้าทั้งตาราง'], a:0,
   e:'ลำดับคือ: save SP, save PC, save PSW (condition codes), สลับไป kernel stack แล้ววาง SP/PC/PSW ลงบนสแต็ก, สลับเป็น kernel mode, vector ผ่าน interrupt table และ handler จึงเซฟรีจิสเตอร์ที่มันอาจทับ'},

  {id:'b107', c:2, q:'เหตุใดตัวจัดการ interrupt จึงถูกเรียกใช้ในสภาพที่ interrupt ถูก "ปิด" อยู่',
   ch:['เพื่อให้ handler เป็นแบบ non-blocking รันจนจบโดยไม่ถูกขัดจังหวะซ้ำ','เพื่อประหยัดพลังงานของซีพียู','เพื่อให้ handler สามารถเข้าถึงดิสก์ได้โดยตรง','เพื่อให้โปรแกรมผู้ใช้รันต่อได้ระหว่างนั้น'], a:0,
   e:'Interrupt masking ทำให้ handler ไม่ถูก interrupt ซ้อน จึงเป็น non-blocking (run to completion, no waits) งานหนัก ๆ จะถูกแพ็กใส่คิวส่งต่อให้เธรดของ OS ทำแทน แล้วจึงเปิด interrupt กลับ'},

  {id:'b108', c:2, q:'ข้อใดคือหน้าที่ของ Interrupt Vector',
   ch:['เป็นอาร์เรย์ของพอยน์เตอร์ที่จำกัดจุดเข้าสู่เคอร์เนลให้มีจำนวนน้อย','เป็นคิวที่เก็บ interrupt ที่ยังไม่ได้ประมวลผล','เป็นพื้นที่เก็บรีจิสเตอร์ของผู้ใช้ระหว่างเกิด interrupt','เป็นตารางที่แปลง virtual address เป็น physical address'], a:0,
   e:'Interrupt vector คืออาร์เรย์ของพอยน์เตอร์ ใช้หมายเลข interrupt เป็นดัชนี ชี้ไปยังที่อยู่และคุณสมบัติของ handler แต่ละตัว ทำให้มี "limited number of entry points into kernel" ส่วนการเก็บรีจิสเตอร์เป็นหน้าที่ของ kernel stack'},

  {id:'b109', c:2, q:'ข้อใดอธิบาย Process ได้ตรงกับนิยามในสไลด์มากที่สุด',
   ch:['อินสแตนซ์ของโปรแกรมที่กำลังทำงานด้วยสิทธิ์ที่จำกัด','ไฟล์ปฏิบัติการที่เก็บอยู่บนฮาร์ดดิสก์','ลำดับคำสั่งหนึ่งชุดภายในโปรแกรม','พื้นที่หน่วยความจำที่เคอร์เนลจองไว้'], a:0,
   e:'Process = "an instance of a program, running with limited rights" ส่วน "ลำดับคำสั่งภายในโปรเซส" คือ Thread และ "เซตของสิทธิ์" คือ Address space'},

  {id:'b110', c:2, q:'โปรเซสประกอบด้วย 2 ส่วนตามสไลด์ คือข้อใด',
   ch:['PCB อยู่ในเคอร์เนล ส่วนที่เหลืออยู่ในฝั่งผู้ใช้','Stack อยู่ในเคอร์เนล ส่วน Heap อยู่ในดิสก์','Code อยู่ในเคอร์เนล ส่วน Data อยู่ในฝั่งผู้ใช้','ตารางหน้าอยู่ในฝั่งผู้ใช้ ส่วน PCB อยู่ในดิสก์'], a:0,
   e:'สไลด์ระบุว่าโปรเซสมี 2 ส่วน: PCB in kernel และ Others in user โดยฝั่งผู้ใช้มี stack, heap, static data, code ส่วนเคอร์เนลมี kernel stack และ PCB'},

  {id:'b111', c:2, q:'รีจิสเตอร์ PC และ SP ในภาพ Address Space ชี้ไปที่ใดตามลำดับ',
   ch:['PC ชี้ไปยังคำสั่งใน Code Segment ส่วน SP ชี้ไปยังตำแหน่งบนสุดของ Stack','PC ชี้ไปยัง Heap ส่วน SP ชี้ไปยัง Static Data','PC ชี้ไปยัง Stack ส่วน SP ชี้ไปยัง Code Segment','ทั้งคู่ชี้ไปยัง Static Data'], a:0,
   e:'Program counter ชี้ไปยังคำสั่งปัจจุบันใน Code Segment ส่วน Stack pointer ชี้ไปยังตำแหน่งบนสุดของสแต็ก'},

  {id:'b112', c:2, q:'ข้อใดคือความแตกต่างระหว่าง Process VM กับ System VM',
   ch:['Process VM รองรับโปรแกรมเดียว ส่วน System VM รองรับ OS ทั้งตัวพร้อมแอปของมัน','Process VM รองรับ OS ทั้งตัว ส่วน System VM รองรับโปรแกรมเดียว','Process VM ทำงานในเคอร์เนล ส่วน System VM ทำงานในฮาร์ดแวร์','ทั้งสองมีความหมายเหมือนกัน'], a:0,
   e:'Process VM คือ "จำลองต่อระบบ" รองรับการทำงานของโปรแกรมเดียว (เป็นฟังก์ชันพื้นฐานของ OS) ส่วน System VM คือ "จำลองทั้งระบบ" รองรับ OS ทั้งตัวและแอปของมัน'},

  {id:'b113', c:2, q:'ในสถาปัตยกรรม UNIX Structure ส่วนใดอยู่ใน Kernel Mode',
   ch:['File system, CPU scheduling, virtual memory และ device driver','Applications และ Standard Libs','Compilers และ interpreters','Terminal controllers และ disks'], a:0,
   e:'Kernel Mode ประกอบด้วย signals/terminal handling, file system, CPU scheduling, character I/O, swapping/block I/O, page replacement, terminal drivers, disk and tape drivers, demand paging, virtual memory ส่วน Applications/Standard Libs อยู่ User Mode และ terminal controllers/disks คือชั้น Hardware'},

  {id:'b114', c:2, q:'ข้อใดเป็นเหตุผลของ Protection ในแง่ "Reliability"',
   ch:['โปรแกรมที่มีบั๊กจะทำร้ายได้เฉพาะตัวมันเอง','ไว้ใจโปรแกรมให้น้อยลง','บังคับส่วนแบ่งของดิสก์และซีพียู','ทำให้โปรแกรมทำงานเร็วขึ้น'], a:0,
   e:'สไลด์ Protection: WHY? แยกไว้ 3 ข้อ — Reliability: buggy programs only hurt themselves, Security and privacy: trust programs less, Fairness: enforce shares of disk, CPU'},

  {id:'b115', c:2, q:'กลไกซอฟต์แวร์ (SW) ที่ใช้ทำ Protection ตามสไลด์คือข้อใด',
   ch:['Process และ System calls','Memory address translation และ Dual mode operation','Interrupt vector และ Kernel stack','TLB และ Page table'], a:0,
   e:'สไลด์แยกเป็น HW (Memory address translation, Dual mode operation) และ SW (Process ซึ่งทำหน้าที่เป็น illusionist, และ System calls ซึ่งเป็นตัวเชื่อมกับ HW)'},

  {id:'b116', c:2, q:'เมื่อจบการทำงานของ interrupt handler สิ่งที่ต้องกู้คืนอย่าง atomic คือข้อใด',
   ch:['Program counter, program stack และ processor status word พร้อมสลับกลับสู่ user mode','เฉพาะ program counter เท่านั้น','ตารางหน้าและ TLB ทั้งหมด','เนื้อหาของฮีปและไฟล์ที่เปิดอยู่'], a:0,
   e:'At end of handler: restore saved registers แล้ว atomically return โดยกู้คืน PC, program stack, PSW/condition codes และสลับกลับไป user mode'},

  {id:'b117', c:2, q:'ข้อใดคือความแตกต่างระหว่าง Polling กับ Interrupts ในการติดต่ออุปกรณ์',
   ch:['Polling เคอร์เนลรอจน I/O เสร็จ ส่วน Interrupts เคอร์เนลไปทำงานอื่นได้ระหว่างนั้น','Polling ใช้ DMA ส่วน Interrupts ใช้ Programmed I/O','Polling เร็วกว่าเสมอในทุกกรณี','Interrupts ใช้ได้เฉพาะกับดิสก์เท่านั้น'], a:0,
   e:'อุปกรณ์ทำงานแบบ asynchronous จาก CPU — Polling: Kernel waits until I/O is done ส่วน Interrupts: Kernel can do other work in the meantime'},

  {id:'b118', c:2, q:'Four Fundamental OS Concepts ตามสไลด์ประกอบด้วยข้อใด',
   ch:['Thread, Address space with translation, Process และ Dual mode operation/Protection','Process, Thread, File และ Socket','Kernel, Shell, Compiler และ Linker','Interrupt, Exception, Syscall และ Upcall'], a:0,
   e:'สี่แนวคิดพื้นฐานคือ Thread (execution context), Address space (with translation), Process (address space + threads ตั้งแต่หนึ่งตัวขึ้นไป) และ Dual mode operation/Protection'},

  {id:'b119', c:2, q:'เป้าหมายสำคัญข้อหนึ่งของ OS คือ "Protecting Process and the Kernel" ซึ่งหมายถึงอะไร',
   ch:['กันไม่ให้โปรแกรมรบกวนเคอร์เนล และกันไม่ให้โปรแกรมรบกวนกันเอง','กันไม่ให้ผู้ใช้ลบไฟล์ของตัวเอง','กันไม่ให้ซีพียูร้อนเกินไป','กันไม่ให้ดิสก์เต็ม'], a:0,
   e:'เมื่อรันหลายโปรแกรมพร้อมกัน ต้อง keep them from interfering with the OS—kernel และ keep them from interfering with each other'},

  {id:'b120', c:2, q:'"User program should not know interrupt has occurred" เป็นคุณสมบัติที่เรียกว่าอะไร',
   ch:['Transparency','Atomicity','Portability','Concurrency'], a:0,
   e:'คุณสมบัตินี้เรียกว่า transparency (transparent restartable execution) คือ interrupt เกิดขึ้นระหว่างคำสั่งและถูก restart อย่างโปร่งใสโดยไม่เปลี่ยนสถานะของโปรเซส'},

  /* ===== บทที่ 3 ===== */
  {id:'b201', c:3, q:'หลังเรียก fork() สำเร็จ ค่าที่ return ในฝั่งพาเรนต์และฝั่งลูกคือข้อใด',
   ch:['พาเรนต์ได้ PID ของลูก ส่วนลูกได้ 0','พาเรนต์ได้ 0 ส่วนลูกได้ PID ของพาเรนต์','ทั้งคู่ได้ 0','ทั้งคู่ได้ PID เดียวกัน'], a:0,
   e:'จากไดอะแกรมในสไลด์: parent → pid = PID ของ child (เช่น 101) ส่วน child → pid = 0 จึงใช้เงื่อนไข if (pid == 0) แยกว่าตนเป็นลูกหรือพาเรนต์'},

  {id:'b202', c:3, q:'ในโค้ด shell ตัวอย่าง เหตุใดบรรทัดหลัง exec(prog, args) จึงถูกคอมเมนต์ว่า "NOT REACHED"',
   ch:['เพราะ exec เปลี่ยนโปรแกรมที่โปรเซสกำลังรัน จึงไม่มีการย้อนกลับมารันโค้ดเดิม','เพราะ exec ทำให้โปรเซสจบการทำงานทันที','เพราะ exec ทำงานแบบ asynchronous','เพราะคอมไพเลอร์ตัดบรรทัดนั้นทิ้ง'], a:0,
   e:'exec โหลดโปรแกรมใหม่ทับลงใน address space ปัจจุบันแล้วเริ่มที่ "start" โค้ดเดิมที่อยู่หลังคำสั่ง exec จึงถูกเขียนทับและไม่มีทางถูกรัน'},

  {id:'b203', c:3, q:'ข้อใดคือความแตกต่างหลักระหว่าง Windows CreateProcess กับ UNIX fork',
   ch:['CreateProcess รับพารามิเตอร์จำนวนมากในคำสั่งเดียว ส่วน fork ไม่รับอาร์กิวเมนต์เลย','CreateProcess ไม่สร้าง PCB แต่ fork สร้าง','fork โหลดโปรแกรมใหม่ ส่วน CreateProcess ไม่โหลด','fork ใช้ได้เฉพาะในเคอร์เนล'], a:0,
   e:'CreateProcess เป็น API เดียวที่ทำทุกอย่าง (สร้าง PCB, สร้าง address space, โหลดโปรแกรม, copy args, init HW context, แจ้ง scheduler) จึงมีพารามิเตอร์เยอะ ส่วน UNIX แยกเป็น fork (ไม่มีอาร์กิวเมนต์) + exec'},

  {id:'b204', c:3, q:'ขั้นตอนใดมีเฉพาะใน fork แต่ไม่มีใน exec',
   ch:['สร้าง address space ใหม่และคัดลอกเนื้อหาทั้งหมดจากพาเรนต์','โหลดโปรแกรมเข้า address space','คัดลอกอาร์กิวเมนต์เข้าหน่วยความจำ','กำหนดค่าเริ่มต้นให้ hardware context'], a:0,
   e:'fork สร้าง PCB และ address space ใหม่พร้อมคัดลอกเนื้อหาจากพาเรนต์ ส่วน exec ทำงานบน address space ปัจจุบัน เพียงโหลดโปรแกรม คัดลอก args และ init hardware context'},

  {id:'b205', c:3, q:'เหตุใดสไลด์จึงบอกว่า UNIX open เป็น "Swiss Army knife"',
   ch:['เพราะมันรวมพฤติกรรมหลายแบบไว้ในคำสั่งเดียวผ่านออปชัน เช่น สร้างถ้าไม่มี หรือคืน error ถ้ามีอยู่แล้ว','เพราะมันเปิดได้เฉพาะไฟล์ข้อความ','เพราะมันทำงานได้เร็วที่สุดในบรรดา system call','เพราะมันต้องใช้คู่กับ fork เสมอ'], a:0,
   e:'open มีออปชันหลายแบบรวมกัน: ถ้าไฟล์ไม่มี → error หรือ สร้างแล้วเปิด, ถ้ามีอยู่ → error หรือ เปิด, ถ้ามีแต่ไม่ว่าง → ล้างแล้วเปิด หรือ error รวมงานของ open/create/exists ไว้ในตัวเดียว'},

  {id:'b206', c:3, q:'เหตุใดการแยก open, create และ exists ออกเป็น 3 ฟังก์ชันจึงมีปัญหาในระบบหลายผู้ใช้',
   ch:['เพราะระหว่างการตรวจสอบกับการสร้าง อาจมีผู้ใช้อื่นมาแทรกแล้วสร้างหรือลบไฟล์นั้นก่อน','เพราะ 3 ฟังก์ชันทำให้โค้ดยาวเกินไป','เพราะคอมไพเลอร์ไม่รองรับฟังก์ชันหลายตัว','เพราะใช้ file descriptor คนละชุด'], a:0,
   e:'สไลด์มีโน้ตว่า "if 1 user single path = OK แต่ multi user multi path" จะมีปัญหา เพราะการตรวจแล้วค่อยทำเป็นสองขั้นแยกกัน ทำให้มีช่องว่างให้คนอื่นมาแทรกได้ (race condition)'},

  {id:'b207', c:3, q:'ความสัมพันธ์ระหว่าง Shell กับ Kernel ตามโน้ตในสไลด์คือข้อใด',
   ch:['Shell เป็นส่วนที่ใกล้ผู้ใช้และควบคุม OS ส่วน Kernel ควบคุมฮาร์ดแวร์','Shell ควบคุมฮาร์ดแวร์ ส่วน Kernel ใกล้ผู้ใช้','Shell เป็นส่วนหนึ่งของ Kernel','Kernel ถูกเรียกใช้โดย Shell เท่านั้น'], a:0,
   e:'โน้ตระบุว่า Shell - ใกล้เคียงกับ User ควบคุม OS, Kernel - ควบคุม HW โดย shell เป็นโปรเซสในฝั่ง user ที่เรียก syscall เพื่อให้เคอร์เนลสร้างโปรเซสใหม่'},

  {id:'b208', c:3, q:'คำสั่ง "dir | more" ในระบบ UNIX/Windows เป็นตัวอย่างของแนวคิดใด',
   ch:['เอาต์พุตของโปรแกรมหนึ่งเป็นอินพุตของอีกโปรแกรมหนึ่ง (pipe)','การเปลี่ยนทิศทางเอาต์พุตลงไฟล์ (redirect)','การอ่านอินพุตจากไฟล์','การสร้างโปรเซสลูกด้วย fork'], a:0,
   e:'เครื่องหมาย | คือ pipe ซึ่งต่อเอาต์พุตของโปรแกรมแรกเข้ากับอินพุตของโปรแกรมที่สอง ส่วน &gt; คือ redirect ลงไฟล์ และ &lt; คืออ่านอินพุตจากไฟล์'},

  {id:'b209', c:3, q:'การสื่อสารระหว่างโปรเซสผ่าน File system มีลักษณะเด่นอย่างไร',
   ch:['ผู้อ่านและผู้เขียนไม่จำเป็นต้องทำงานพร้อมกัน','ต้องใช้ socket เสมอ','เป็นการสื่อสารทางเดียวเท่านั้น','ต้องอยู่บนเครื่องเดียวกันเท่านั้น'], a:0,
   e:'File system: เขียนข้อมูลลงไฟล์แล้วอ่านไฟล์เป็นอินพุต จุดเด่นคือ "Reader and writer are not need to running at the same time" ต่างจาก pipe ที่ต้องทำงานพร้อมกันทั้งสองฝั่ง'},

  {id:'b210', c:3, q:'ข้อใดคือข้อเสียของ Microkernel',
   ch:['ช้า และจำเป็นต้องมี context switch เมื่อ driver รันเป็นโปรเซส','ถ้าจะแก้ต้องแก้ทั้งระบบ','พอร์ตโค้ดเข้ายาก','บริการพังหนึ่งตัวทำให้พังทั้งระบบ'], a:0,
   e:'ข้อเสียของ Microkernel คือ ช้า, จำเป็นต้องมี context switch เมื่อ driver รันเป็นโปรเซส, ประสิทธิภาพอาจรวนจนเกิดปัญหา และแพง ส่วนตัวเลือกอื่นเป็นข้อเสียของ Monolithic kernel'},

  {id:'b211', c:3, q:'ในแผนภาพของ Microkernel ส่วนใดยังคงอยู่ใน Kernel Space',
   ch:['Basic IPC, Virtual Memory และ Scheduling','File Server และ Device Driver','VFS และ System calls','Application IPC และ Unix Server'], a:0,
   e:'Microkernel เก็บเฉพาะ Basic IPC, Virtual Memory, Scheduling ไว้ใน kernel space ส่วน Application IPC, Unix Server, Device Driver, File Server ย้ายขึ้นไปอยู่ user space'},

  {id:'b212', c:3, q:'หากต้องการให้โปรเซสลูกรันโปรแกรมอื่น โปรแกรมเมอร์ UNIX ต้องเรียกอะไรตามลำดับ',
   ch:['fork แล้วตามด้วย exec ในฝั่งลูก','exec แล้วตามด้วย fork ในฝั่งพาเรนต์','fork อย่างเดียวก็เพียงพอ','wait แล้วตามด้วย signal'], a:0,
   e:'รูปแบบมาตรฐานคือ pid = fork(); if (pid == 0) exec(...); else wait(pid); คือ fork สร้างสำเนาก่อน แล้วฝั่งลูกจึงเรียก exec เพื่อเปลี่ยนโปรแกรมที่รันอยู่'},

  {id:'b213', c:3, q:'หากพาเรนต์เรียก wait(pid) แล้วโปรเซสลูกยังทำงานไม่เสร็จ จะเกิดอะไรขึ้น',
   ch:['พาเรนต์จะหยุดรอจนกว่าลูกจะทำงานเสร็จ','พาเรนต์จะรันต่อทันทีโดยไม่สนใจลูก','ลูกจะถูกยกเลิกทันที','เกิด exception ที่พาเรนต์'], a:0,
   e:'wait คือ system call ที่รอให้โปรเซสทำงานเสร็จ ถ้าลูกยังไม่เสร็จ พาเรนต์จะถูกบล็อกไว้ก่อน โน้ตในสไลด์ถามว่า "wait() สั้นก็ทำได้เลยหรือ?" คำตอบคือถ้าลูกเสร็จแล้วก็ผ่านไปเลย'},

  {id:'b214', c:3, q:'ข้อใดอธิบาย Kernel-buffered read/write ได้ถูกต้อง',
   ch:['ทำงานได้เร็วกว่าเพราะข้อมูลถูกพักไว้ในบัฟเฟอร์ของเคอร์เนลก่อน','ข้อมูลถูกเขียนลงดิสก์ทันทีทุกครั้งที่เรียก write','เคอร์เนลไม่ยุ่งเกี่ยวกับข้อมูลเลย','ต้องใช้ DMA เสมอ'], a:0,
   e:'โน้ตในสไลด์ระบุว่าการทำงานผ่าน buffer ในเคอร์เนลเป็น buffer ชั่วคราว ทำให้เร็วกว่าการรอเข้าถึงอุปกรณ์จริงทุกครั้ง'},

  /* ===== บทที่ 4 ===== */
  {id:'b301', c:4, q:'ในโปรแกรม threadHello ที่สร้าง 10 เธรด เหตุใดบรรทัด "Thread %d returned" จึงพิมพ์เรียงตามลำดับเสมอ',
   ch:['เพราะ main เรียก thread_join ตามลำดับดัชนี i จึงรอทีละตัวเรียงกันไป','เพราะ OS รับประกันว่าเธรดจะจบเรียงตามลำดับที่สร้าง','เพราะ printf เป็นคำสั่ง atomic','เพราะทุกเธรดใช้ lock เดียวกัน'], a:0,
   e:'ลูปที่สองเรียก thread_join(threads[i]) ไล่จาก i=0 ไป 9 ดังนั้น main จะรอ thread 0 ก่อนเสมอ แล้วจึงพิมพ์ จึงเรียงลำดับ ส่วนบรรทัด "Hello from thread" ไม่เรียงเพราะขึ้นกับตารางเวลา'},

  {id:'b302', c:4, q:'ข้อใดคือสถานะที่ "ไม่" ถูกแชร์ระหว่างเธรดในโปรเซสเดียวกัน',
   ch:['Stack','Code','Global Variables','Heap'], a:0,
   e:'Shared State ได้แก่ Code, Global Variables และ Heap ส่วน Per-Thread State คือ TCB (stack information, saved registers, thread metadata) และ Stack ของแต่ละเธรด'},

  {id:'b303', c:4, q:'เธรดเปลี่ยนจากสถานะ Running ไปเป็น Waiting ได้อย่างไร',
   ch:['เมื่อเธรดรอเหตุการณ์ เช่น เรียก thread_join()','เมื่อ scheduler เลือกให้รันต่อ','เมื่อเรียก thread_create()','เมื่อเรียก thread_exit()'], a:0,
   e:'จาก Thread Lifecycle: Running → Waiting เมื่อ "Thread Waits for Event" เช่น sthread_join() และ Waiting → Ready เมื่อ "Event Occurs" ส่วน thread_exit พา Running → Finished'},

  {id:'b304', c:4, q:'ข้อใดเป็น Involuntary context switch',
   ch:['เกิด interrupt หรือ exception หรือมีเธรดอื่นที่ priority สูงกว่า','การเรียก thread_yield','การเรียก thread_join เมื่อลูกยังไม่เสร็จ','การเรียก thread_create'], a:0,
   e:'Voluntary ได้แก่ Thread_yield และ Thread_join (ถ้าลูกยังไม่เสร็จ) ส่วน Involuntary ได้แก่ interrupt หรือ exception และกรณีที่มีเธรดอื่นมีลำดับความสำคัญสูงกว่า'},

  {id:'b305', c:4, q:'ข้อใดอธิบายความสัมพันธ์ระหว่าง Thread กับ Protection ได้ถูกต้อง',
   ch:['Protection เป็นแนวคิดที่ตั้งฉาก (orthogonal) กับเธรด จะมีหนึ่งหรือหลายเธรดต่อหนึ่ง protection domain ก็ได้','ทุกเธรดต้องมี protection domain ของตัวเองเสมอ','เธรดไม่สามารถอยู่ร่วม protection domain เดียวกันได้','Protection ถูกกำหนดโดยจำนวนเธรดเท่านั้น'], a:0,
   e:'สไลด์ระบุว่า "Protection is an orthogonal concept — Can have one or many threads per protection domain" คือสองเรื่องนี้แยกจากกันได้อิสระ'},

  {id:'b306', c:4, q:'ข้อใดคือความแตกต่างระหว่าง Multi-threaded kernel กับ Multiprocess kernel',
   ch:['Multi-threaded kernel มีหลายเธรดใช้โครงสร้างข้อมูลเคอร์เนลร่วมกัน ส่วน Multiprocess kernel เป็นโปรเซสเธรดเดียวหลายตัวที่เข้าถึงโครงสร้างข้อมูลร่วมผ่าน system call','Multi-threaded kernel ไม่สามารถใช้คำสั่งที่มีสิทธิ์พิเศษได้','Multiprocess kernel มีเพียงหนึ่งโปรเซสเสมอ','ทั้งสองแบบไม่มีความแตกต่างกัน'], a:0,
   e:'Multi-threaded kernel: multiple threads, sharing kernel data structures, capable of using privileged instructions ส่วน Multiprocess kernel: multiple single-threaded processes ที่ใช้ system call เข้าถึงโครงสร้างข้อมูลเคอร์เนลที่แชร์กัน'},

  {id:'b307', c:4, q:'ใน Thread Abstraction สิ่งที่โปรแกรมเมอร์สมมติว่ามีคืออะไร',
   ch:['จำนวนโปรเซสเซอร์ที่ไม่จำกัด และเธรดทำงานด้วยความเร็วที่ไม่แน่นอน','จำนวนโปรเซสเซอร์เท่ากับจำนวนเธรดเสมอ','เธรดทุกตัวทำงานด้วยความเร็วเท่ากันเสมอ','เธรดถูกรันเรียงทีละตัวตามลำดับที่สร้าง'], a:0,
   e:'Thread Abstraction สมมติว่ามี Infinite number of processors และ Threads execute with variable speed ดังนั้นโปรแกรมต้องถูกออกแบบให้ทำงานได้กับทุกตารางเวลา'},

  {id:'b308', c:4, q:'Green threads (Java ยุคแรก) มีลักษณะอย่างไร',
   ch:['เป็นไลบรารีระดับผู้ใช้ในโปรเซสเธรดเดียว ไลบรารีทำ context switch เอง และใช้ upcall/signal จาก timer interrupt ในการแย่งซีพียู','เป็นเธรดของเคอร์เนลที่เรียกผ่าน system call ทุกครั้ง','เป็นเธรดที่ไม่ต้องใช้สแต็ก','เป็นแนวทางที่เคอร์เนลจัดสรรโปรเซสเซอร์ให้ไลบรารีผู้ใช้'], a:0,
   e:'Green threads = user-level library ภายใน single-threaded process, library ทำ context switch, preemption ผ่าน upcall/UNIX signal บน timer interrupt และใช้หลายโปรเซสเพื่อความขนาน ส่วนตัวเลือกสุดท้ายคือ Scheduler activations'},

  {id:'b309', c:4, q:'ข้อเสียของแนวทาง "User thread = kernel thread" (Linux, MacOS) คืออะไร',
   ch:['เรียบง่าย แต่มีการเปลี่ยนไปมาระหว่าง user mode กับ kernel mode เป็นจำนวนมาก','ไม่สามารถทำ context switch ได้','ไม่รองรับการทำงานแบบขนาน','ต้องเขียนไลบรารีระดับผู้ใช้เอง'], a:0,
   e:'สไลด์ระบุว่า "Simple, but a lot of transitions between user and kernel mode" เพราะ thread fork/join/exit และ lock/unlock ต้องเรียกผ่าน system call ทั้งหมด'},

  {id:'b310', c:4, q:'ใน Faster Thread/Process Switch เมื่อ handler ตัดสินใจรันเธรดใหม่ สิ่งที่เกิดขึ้นคืออะไร',
   ch:['โยนสถานะปัจจุบันของ interrupt handler ทิ้ง แล้วตั้ง saved stack pointer ให้ชี้ไปยัง trapframe','บันทึกสถานะของ handler ลงดิสก์','เรียก thread_create เพื่อสร้างเธรดใหม่','ปิด interrupt ถาวรจนกว่าเธรดเดิมจะกลับมา'], a:0,
   e:'วิธีเร็วคือ: handler เซฟสถานะเธรดที่ถูกขัดจังหวะ, ตัดสินใจรันเธรดใหม่, โยนสถานะปัจจุบันของ handler ทิ้ง, ตั้ง saved stack pointer ให้ชี้ trapframe, กู้คืนสถานะของเธรดใหม่ ซึ่งหลีกเลี่ยงการเซฟ/กู้สองรอบแบบ OS/161 รุ่นง่าย'},

  {id:'b311', c:4, q:'stub ที่ถูกวางไว้ที่ฐานของสแต็กในการสร้างเธรดมีหน้าที่อะไร',
   ch:['เรียก (*func)(args) และถ้า return กลับมาก็เรียก thread_exit()','จัดสรรหน่วยความจำให้ฮีป','บันทึกรีจิสเตอร์ลง TCB','ปลุกเธรดที่รออยู่'], a:0,
   e:'stub(func, args) ใน OS/161 คือ mips_threadstart ทำหน้าที่เรียก (*func)(args) และถ้าฟังก์ชันนั้น return กลับมา ก็จะเรียก thread_exit() ให้โดยอัตโนมัติ'},

  /* ===== บทที่ 5 ===== */
  {id:'b401', c:5, q:'ใน Too Much Milk Try #2 ที่ทั้งสองฝ่ายทิ้งโน้ตก่อนแล้วค่อยตรวจโน้ตของอีกฝ่าย ปัญหาที่เกิดขึ้นคืออะไร',
   ch:['ทั้งสองฝ่ายอาจไม่ซื้อนมเลย เกิดเป็น Starvation','ทั้งสองฝ่ายซื้อนมพร้อมกัน','โปรแกรมจะ crash ทันที','เกิด deadlock ที่ทั้งคู่รอตลอดกาล'], a:0,
   e:'ถ้าทั้งคู่ทิ้งโน้ตพร้อมกัน แล้วต่างฝ่ายต่างเห็นโน้ตของอีกฝ่าย ทั้งคู่จะข้ามการซื้อไปหมด ทำให้ไม่มีใครซื้อนม สไลด์กำกับไว้ว่า Starvation (อดอยาก) ซึ่งละเมิดคุณสมบัติ liveness'},

  {id:'b402', c:5, q:'ใน Too Much Milk Try #3 Thread A ใช้ while (note B) do nothing ซึ่งรับประกันอะไร',
   ch:['ที่จุด X และ Y จะได้ว่า ปลอดภัยที่ฉันจะซื้อ หรือ อีกฝ่ายจะซื้อแล้วฉันเลิกได้','ทั้งสองฝ่ายจะซื้อนมพร้อมกันเสมอ','ไม่มีฝ่ายใดต้องรอเลย','ไม่ต้องใช้โน้ตอีกต่อไป'], a:0,
   e:'สไลด์ระบุว่า Can guarantee at X and Y that either: (i) Safe for me to buy, (ii) Other will buy, ok to quit โดย A ต้องรอคอย (busy wait) ส่วน B ไม่ต้องรอ'},

  {id:'b403', c:5, q:'บทเรียน (Lessons) จาก Too Much Milk คือข้อใด',
   ch:['วิธีแก้ซับซ้อน โค้ดที่ดูชัดเจนมักมีบั๊ก และคอมไพเลอร์/สถาปัตยกรรมสมัยใหม่ยังสลับลำดับคำสั่งอีก','การซิงโครไนซ์เป็นเรื่องง่ายถ้าเขียนโค้ดระวัง','ปัญหานี้แก้ได้ด้วยการเพิ่มจำนวนเธรด','ปัญหาหายไปเองบนเครื่องโปรเซสเซอร์เดียว'], a:0,
   e:'Lessons: Solution is complicated, "obvious" code often has bugs, Modern compilers/architectures reorder instructions และการขยายไปหลายเธรด/โปรเซสเซอร์ยิ่งซับซ้อน (ดู Peterson’s algorithm)'},

  {id:'b404', c:5, q:'เหตุใดคอมไพเลอร์จึงสลับลำดับคำสั่ง (reorder instructions)',
   ch:['เพราะการสร้างโค้ดที่มีประสิทธิภาพต้องวิเคราะห์ control/data dependency และถ้าตัวแปรเปลี่ยนเองได้ การ optimize แทบจะเป็นไปไม่ได้','เพราะต้องการลดขนาดไฟล์ปฏิบัติการ','เพราะต้องการให้โปรแกรมอ่านง่ายขึ้น','เพราะต้องการเพิ่มความปลอดภัย'], a:0,
   e:'สไลด์ระบุว่า Efficient code generation requires analyzing control/data dependency และ If variables can spontaneously change, most compiler optimizations become impossible ส่วนซีพียูสลับลำดับเพราะ write buffering'},

  {id:'b405', c:5, q:'เหตุใดซีพียูจึงสลับลำดับคำสั่ง',
   ch:['เพราะ write buffering ยอมให้คำสั่งถัดไปทำงานได้ขณะที่การเขียนยังไม่เสร็จ','เพราะต้องการให้โค้ดสั้นลง','เพราะต้องการลดจำนวนรีจิสเตอร์ที่ใช้','เพราะต้องการให้ cache hit rate สูงขึ้น'], a:0,
   e:'สไลด์ระบุเหตุผลเดียวคือ Write buffering: allow next instruction to execute while write is being completed'},

  {id:'b406', c:5, q:'วิธีแก้ปัญหาการสลับลำดับคำสั่งคืออะไร',
   ch:['Memory barrier','Interrupt masking','Context switch','Page coloring'], a:0,
   e:'Fix: memory barrier คือคำสั่งที่บอกคอมไพเลอร์/ซีพียูว่า ทุก operation ก่อน barrier ต้องเสร็จก่อนที่ barrier จะ return และไม่มี operation หลัง barrier เริ่มได้จนกว่า barrier จะ return'},

  {id:'b407', c:5, q:'เหตุใดโค้ดตรวจสอบแบบ if (p == NULL) { lock.acquire(); ... } จึงเป็นอันตราย',
   ch:['เพราะมีการอ่านข้อมูลที่ใช้ร่วมกันนอก lock ซึ่งละเมิดกฎ "ห้ามเข้าถึงข้อมูลร่วมโดยไม่มี lock"','เพราะ lock ถูก acquire สองครั้ง','เพราะ lock ไม่ถูก release','เพราะ malloc ไม่ปลอดภัยต่อเธรด'], a:0,
   e:'กฎข้อสุดท้ายของการใช้ lock คือ Never access shared data without lock — Danger! การอ่าน p นอก lock และใช้ p->field1 หลัง release อาจเห็นค่าที่ยังไม่ถูก initialize ครบ เพราะคำสั่งอาจถูกสลับลำดับ'},

  {id:'b408', c:5, q:'ข้อใดถูกต้องเกี่ยวกับ Semaphore',
   ch:['มีได้เพียง 2 การดำเนินการคือ P และ V ซึ่งเป็น atomic และถ้าค่าเป็น 1 แล้วมี P สองครั้ง จะเหลือค่า 0 กับผู้รอหนึ่งราย','สามารถมีค่าติดลบได้','P เพิ่มค่า ส่วน V ลดค่า','ต้องใช้คู่กับ condition variable เสมอ'], a:0,
   e:'Semaphore มีค่าจำนวนเต็มไม่ติดลบ, P() รออย่าง atomic ให้ค่า > 0 แล้วลดค่า, V() เพิ่มค่าอย่าง atomic สไลด์ยกตัวอย่างว่า "If value is 1, two P’s will result in value 0 and one waiter"'},

  {id:'b409', c:5, q:'เหตุใดใน Condition Variable Design Pattern จึงใช้ while (!testSharedState()) แทนที่จะใช้ if',
   ch:['เพราะเมื่อถูกปลุกขึ้นมาและได้ lock คืน เงื่อนไขอาจถูกเธรดอื่นเปลี่ยนไปแล้ว จึงต้องตรวจซ้ำ','เพราะ if ใช้กับ condition variable ไม่ได้ทางไวยากรณ์','เพราะ while ทำงานเร็วกว่า if','เพราะต้องการให้เธรดวนรอแบบ busy wait'], a:0,
   e:'cv.wait() ปล่อย lock แล้วไปรอ เมื่อถูก signal จะกลับมา reacquire lock แต่ระหว่างนั้นเธรดอื่นอาจเข้ามาเปลี่ยนสถานะร่วมไปแล้ว จึงต้องวนตรวจเงื่อนไขซ้ำทุกครั้งที่ตื่น'},

  {id:'b410', c:5, q:'ข้อใดคือความแตกต่างระหว่าง cv.signal() กับ cv.broadcast()',
   ch:['signal ปลุกผู้รอหนึ่งตัว ส่วน broadcast ปลุกผู้รอทั้งหมด','signal ปลุกผู้รอทั้งหมด ส่วน broadcast ปลุกหนึ่งตัว','signal ต้องถือ lock ส่วน broadcast ไม่ต้อง','ทั้งสองมีผลเหมือนกันทุกประการ'], a:0,
   e:'Signal: wake up a waiter, if any ส่วน Broadcast: wake up all waiters, if any ทั้งคู่ต้องถูกเรียกขณะถือ lock อยู่'},

  {id:'b411', c:5, q:'Lock Example: Malloc/Free ใช้ heaplock ป้องกันอะไร',
   ch:['โครงสร้างข้อมูลของฮีปซึ่งเป็นทรัพยากรที่ใช้ร่วมกัน','รีจิสเตอร์ของซีพียู','ตารางหน้าของโปรเซส','file descriptor ที่เปิดอยู่'], a:0,
   e:'ทั้ง malloc (allocate memory) และ free (put p back on free list) ต่างแก้ไข free list ของฮีปซึ่งเป็น shared resource จึงต้องยึด heaplock ก่อนและปล่อยหลังเสมอ'},

  {id:'b412', c:5, q:'ในคำถาม "Can this panic?" ที่ Thread 1 ตั้ง p แล้วตั้ง pInitialized = true ส่วน Thread 2 วนรอ pInitialized ปัญหาคืออะไร',
   ch:['คำสั่งอาจถูกสลับลำดับ ทำให้ pInitialized เป็น true ก่อนที่ p จะถูกคำนวณเสร็จ','Thread 2 จะวนรอตลอดกาลเสมอ','someFunction ไม่ใช่ฟังก์ชันบริสุทธิ์','pInitialized ต้องเป็น int ไม่ใช่ bool'], a:0,
   e:'เพราะไม่มี memory barrier คอมไพเลอร์หรือซีพียูอาจเขียน pInitialized = true ก่อน p = someComputation() ทำให้ Thread 2 หลุดออกจากลูปแล้วอ่าน p ที่ยังไม่พร้อม จึงเกิด panic ได้'},

  {id:'b413', c:5, q:'ข้อใดคือนิยามของ Critical section',
   ch:['ชิ้นส่วนของโค้ดที่มีเธรดเดียวเท่านั้นที่รันได้ในแต่ละครั้ง','ส่วนของโค้ดที่ทำงานเร็วที่สุด','ส่วนของโค้ดที่อยู่ในเคอร์เนลเท่านั้น','ส่วนของโค้ดที่ไม่มีการเข้าถึงหน่วยความจำ'], a:0,
   e:'Critical section คือ piece of code that only one thread can execute at once ซึ่งเป็นกลไกที่ใช้บรรลุ Mutual exclusion'},

  {id:'b414', c:5, q:'ประโยคใดสรุปแก่นของการซิงโครไนซ์ได้ถูกต้องตามสไลด์',
   ch:['การซิงโครไนซ์ทั้งหมดเกี่ยวข้องกับการรอคอย (all synchronization involves waiting)','การซิงโครไนซ์ทำให้โปรแกรมเร็วขึ้นเสมอ','การซิงโครไนซ์ไม่จำเป็นบนโปรเซสเซอร์เดียว','การซิงโครไนซ์แทนที่ความจำเป็นของ lock'], a:0,
   e:'สไลด์ระบุว่า Wait if locked (all synchronization involves waiting!) คือราคาที่ต้องจ่ายของการประสานงานระหว่างเธรด'},

  /* ===== บทที่ 6 ===== */
  {id:'b501', c:6, q:'บนภาระงานแบบใดที่ FIFO ให้ประสิทธิภาพแย่เป็นพิเศษ',
   ch:['เมื่องานมีขนาดแตกต่างกันมาก และงานยาวมาถึงก่อน','เมื่องานทุกงานมีขนาดเท่ากัน','เมื่อมีงานเพียงงานเดียว','เมื่อทุกงานเป็นแบบ I/O bound'], a:0,
   e:'FIFO รันจนเสร็จตามลำดับที่มา ถ้างานยาวมาก่อน งานสั้นที่ตามมาจะต้องรอทั้งหมด ทำให้ average response time แย่มาก แต่ถ้างานขนาดเท่ากัน FIFO กลับเป็น optimal'},

  {id:'b502', c:6, q:'ข้อใดถูกต้องเกี่ยวกับ SJF',
   ch:['ให้ average response time ที่ดีที่สุดเมื่อพิจารณาเฉพาะโปรเซสเซอร์ แต่แย่ที่สุดในแง่ความแปรปรวนของเวลาตอบสนอง','ให้ทั้ง average response time และความแปรปรวนที่ดีที่สุด','ให้ความเป็นธรรม (fairness) ที่ดีที่สุด','ไม่ต้องรู้ปริมาณงานที่เหลือก็ทำงานได้'], a:0,
   e:'Uniprocessor Summary: "Considering only the processor, SJF is optimal in terms of average response time" และ "SJF is pessimal in terms of variance in response time" คืองานยาวอาจถูกเลื่อนไปเรื่อย ๆ'},

  {id:'b503', c:6, q:'ถ้างานทุกงานมีขนาดเท่ากัน Round Robin จะให้ผลอย่างไร',
   ch:['ให้ average response time ที่แย่มาก','ให้ average response time ที่ดีที่สุด','ให้ผลเหมือน SJF ทุกประการ','ทำให้เกิด starvation'], a:0,
   e:'Uniprocessor Summary: "If tasks are equal in size, Round Robin will have very poor average response time" เพราะทุกงานจะเสร็จพร้อม ๆ กันตอนท้าย ในขณะที่ FIFO จะทยอยให้งานเสร็จเร็วกว่า'},

  {id:'b504', c:6, q:'จะเกิดอะไรขึ้นถ้าตั้ง time quantum ของ Round Robin ให้สั้นมาก เช่น หนึ่งคำสั่ง',
   ch:['Overhead จากการสลับบริบทจะสูงมากจนกินประสิทธิภาพ','ระบบจะกลายเป็น FIFO','ระบบจะกลายเป็น SJF','ไม่มีผลใด ๆ ต่อประสิทธิภาพ'], a:0,
   e:'time quantum สั้นเกินไปทำให้ context switch ถี่มาก ค่า overhead จึงสูง ส่วนถ้า quantum ยาวเป็นอนันต์ Round Robin จะเสื่อมกลายเป็น FIFO'},

  {id:'b505', c:6, q:'ข้อใดอธิบายหลักการของ Max-Min Fairness ได้ถูกต้อง',
   ch:['ถ้างานใดต้องการน้อยกว่าส่วนแบ่งเท่า ๆ กัน ให้จัดงานที่เล็กที่สุดนั้นก่อน แล้วแบ่งเวลาที่เหลือด้วยวิธีเดียวกัน','ให้งานที่ใหญ่ที่สุดได้รับส่วนแบ่งมากที่สุด','แบ่งเวลาเท่า ๆ กันให้ทุกงานโดยไม่สนความต้องการ','ให้งานที่มาก่อนได้ทั้งหมดก่อน'], a:0,
   e:'Max-Min: maximize the minimum allocation; ถ้างานใดต้องการน้อยกว่า equal share ให้จัดตัวที่เล็กสุดก่อน แล้วแบ่งเวลาที่เหลือด้วย max-min ซ้ำ ถ้างานที่เหลือทุกตัวต้องการอย่างน้อยเท่า ๆ กันก็แบ่งเท่ากัน'},

  {id:'b506', c:6, q:'ใน MFQ คิวที่มีลำดับความสำคัญสูงมีลักษณะอย่างไร',
   ch:['มี time slice สั้น ส่วนคิวลำดับความสำคัญต่ำมี time slice ยาว','มี time slice ยาว ส่วนคิวลำดับความสำคัญต่ำมี time slice สั้น','ทุกคิวมี time slice เท่ากัน','ไม่มี time slice เลย'], a:0,
   e:'High priority queues have short time slices / Low priority queues have long time slices งานเริ่มที่คิวสูงสุด ถ้าใช้ time slice จนหมดก็ตกลงหนึ่งระดับ ทำให้งาน I/O bound ที่ใช้ซีพียูสั้น ๆ ยังอยู่คิวสูงและตอบสนองเร็ว'},

  {id:'b507', c:6, q:'งานประเภทใดที่มักอยู่ในคิวลำดับความสำคัญสูงสุดของ MFQ',
   ch:['งานใหม่และงานที่เป็น I/O bound','งานที่ใช้ซีพียูหนักและต่อเนื่อง','งานที่รันมานานที่สุด','งานที่ใช้หน่วยความจำมากที่สุด'], a:0,
   e:'จากแผนภาพ "New or I/O Bound Task" เข้าที่คิวสูงสุด เพราะงานพวกนี้ใช้ซีพียูสั้น ๆ แล้วไปรอ I/O จึงไม่เคยใช้ time slice จนหมด และไม่ตกลงไปคิวล่าง'},

  {id:'b508', c:6, q:'ข้อใดอธิบาย Work-conserving ได้ถูกต้อง',
   ch:['ทรัพยากรจะถูกใช้งานเสมอเมื่อยังมีงานรออยู่','ทรัพยากรจะถูกสงวนไว้สำหรับงานสำคัญ','งานทุกงานจะได้รับทรัพยากรเท่ากัน','งานจะไม่ถูกแย่งทรัพยากรกลับคืน'], a:0,
   e:'Work-conserving: Resource is used whenever there is a task to run สไลด์ระบุว่าจะพิจารณาเฉพาะตัวจัดตารางที่เป็น preemptive และ work-conserving เท่านั้น'},

  {id:'b509', c:6, q:'อัลกอริทึมการจัดตารางเวลา (Scheduling algorithm) รับอะไรเป็นอินพุตและให้อะไรเป็นเอาต์พุต',
   ch:['รับ workload เป็นอินพุต ตัดสินใจว่าจะทำงานใดก่อน และให้ตัววัดประสิทธิภาพ เช่น throughput, latency เป็นเอาต์พุต','รับ PCB เป็นอินพุต และให้ address space เป็นเอาต์พุต','รับ time quantum เป็นอินพุต และให้จำนวนเธรดเป็นเอาต์พุต','รับซอร์สโค้ดเป็นอินพุต และให้ไฟล์ปฏิบัติการเป็นเอาต์พุต'], a:0,
   e:'สไลด์ระบุว่า scheduling algorithm takes a workload as input, decides which tasks to do first และให้ performance metric (throughput, latency) as output'},

  {id:'b510', c:6, q:'ข้อใดอธิบาย Mixed Workload ได้ถูกต้อง',
   ch:['มีทั้งงาน I/O bound ที่ต้องการซีพียูน้อย และงาน CPU bound ที่ใช้ซีพียูได้มากเท่าที่ได้รับจัดสรร','มีแต่งาน CPU bound เท่านั้น','มีแต่งาน I/O bound เท่านั้น','เป็นงานที่สลับระหว่างสองเครื่องคอมพิวเตอร์'], a:0,
   e:'Mixed Workload คือการผสมงานซ้ำ ๆ ที่ต่างชนิดกัน: Some I/O bound, need only a little CPU และ Some compute bound, can use as much CPU as they are assigned ซึ่งเป็นที่มาของ Max-Min Fairness'},

  {id:'b511', c:6, q:'งานที่สลับระหว่างการใช้โปรเซสเซอร์และ I/O จะได้ประโยชน์จากนโยบายใด',
   ch:['SJF และอาจทำได้ไม่ดีภายใต้ Round Robin','Round Robin เท่านั้น','FIFO เท่านั้น','ไม่มีนโยบายใดช่วยได้'], a:0,
   e:'Uniprocessor Summary: "Tasks that intermix processor and I/O benefit from SJF and can do poorly under Round Robin" เพราะ RR จะทำให้งานพวกนี้ต้องรอครบรอบก่อนจึงจะได้ยิง I/O ครั้งถัดไป'},

  {id:'b512', c:6, q:'นโยบายใดบ้างที่หลีกเลี่ยง starvation ได้',
   ch:['Round Robin และ Max-Min fairness','FIFO และ SJF','SJF และ SRTF','SJF เท่านั้น'], a:0,
   e:'Uniprocessor Summary: "Round Robin and Max-Min fairness both avoid starvation" ส่วน SJF/SRTF อาจทำให้งานยาวอดอยากได้ถ้ามีงานสั้นไหลเข้ามาเรื่อย ๆ'},

  /* ===== บทที่ 7 ===== */
  {id:'b601', c:7, q:'ข้อเสียหลักของ Virtually Addressed Base and Bounds คืออะไร',
   ch:['แชร์โค้ด/ข้อมูลกับโปรเซสอื่นไม่ได้ และขยายสแต็ก/ฮีปตามต้องการไม่ได้','ทำงานช้าเพราะต้องค้นตารางหลายระดับ','เกิด internal fragmentation มาก','ต้องใช้ TLB เสมอ'], a:0,
   e:'Cons ของ Base and Bound: Can’t keep program from accidentally overwriting its own code, Can’t share code/data with other processes, Can’t grow stack/heap as needed ส่วน Pros คือ simple, fast, safe และ relocate ได้'},

  {id:'b602', c:7, q:'ปัญหาหลักของ Segmentation ที่ Paging แก้ได้คืออะไร',
   ch:['External fragmentation เพราะต้องหาก้อนตามขนาดที่กำหนด','Internal fragmentation เพราะหน้ามีขนาดคงที่','ไม่สามารถตั้งสิทธิ์การเข้าถึงได้','ไม่สามารถแชร์ระหว่างโปรเซสได้'], a:0,
   e:'Segment มีขนาดไม่คงที่ จึงต้องหาก้อนว่างตามขนาดที่ต้องการและอาจต้องจัดเรียงหน่วยความจำใหม่ เกิด external fragmentation ส่วน Paging ใช้หน่วยขนาดคงที่ จึงหาที่ว่างได้ง่ายด้วย bitmap'},

  {id:'b603', c:7, q:'เหตุใด Multi-level Translation จึงเหมาะกับ Sparse address space',
   ch:['เพราะจัดสรรและเติมเฉพาะรายการของตารางหน้าที่ถูกใช้งานจริงเท่านั้น','เพราะใช้การค้นหาเพียงครั้งเดียวต่อการอ้างหน่วยความจำ','เพราะไม่ต้องใช้ตารางใด ๆ','เพราะเก็บทุกรายการไว้ใน TLB'], a:0,
   e:'Pros ของ multi-level: "Allocate/fill only page table entries that are in use" ถ้าใช้ตารางหน้าชั้นเดียวบนระบบ 32 บิต page 4KB จะต้องมี 500K entries ต่อโปรเซส ซึ่งเปลืองมากเมื่อที่อยู่กระจัดกระจาย'},

  {id:'b604', c:7, q:'ข้อเสียของ Multi-level Translation คืออะไร',
   ch:['มี space overhead คือหนึ่งพอยน์เตอร์ต่อหนึ่งหน้าเสมือน และต้องค้นหาสองครั้งขึ้นไปต่อการอ้างหน่วยความจำ','ไม่สามารถแชร์ที่ระดับหน้าหรือ segment ได้','เกิด external fragmentation มาก','ไม่สามารถตั้งสิทธิ์การเข้าถึงได้'], a:0,
   e:'Cons: Space overhead: one pointer per virtual page และ Two (or more) lookups per memory reference ซึ่งเป็นเหตุผลที่ต้องมี TLB มาช่วย'},

  {id:'b605', c:7, q:'สูตรของ Cost of translation ตามสไลด์คือข้อใด',
   ch:['Cost of TLB lookup + Prob(TLB miss) × cost of page table lookup','Cost of TLB lookup × cost of page table lookup','Cost of page table lookup − Prob(TLB hit)','Prob(TLB miss) × Cost of TLB lookup'], a:0,
   e:'สไลด์ระบุสูตรตรง ๆ ว่า Cost of translation = Cost of TLB lookup + Prob(TLB miss) * cost of page table lookup'},

  {id:'b606', c:7, q:'ในรูปแบบ Paged Segmentation รายการในตาราง segment เก็บอะไรบ้าง',
   ch:['พอยน์เตอร์ไปยังตารางหน้า, ความยาวของตารางหน้า และสิทธิ์การเข้าถึง','หมายเลข frame และสิทธิ์การเข้าถึง','จุดเริ่ม, ความยาว และ offset','เฉพาะหมายเลข frame เท่านั้น'], a:0,
   e:'Segment table entry: Pointer to page table, Page table length (# of pages in segment), Access permissions ส่วน Page table entry: Page frame, Access permissions'},

  {id:'b607', c:7, q:'เมื่อเกิด TLB miss ระบบจะทำอะไรต่อ',
   ch:['ไปไล่ค้นตารางหน้าหลายระดับเพื่อหาการแปลที่อยู่','เกิด exception และยกเลิกโปรเซสทันที','ใช้ที่อยู่เสมือนเป็นที่อยู่จริงโดยตรง','เรียก system call เพื่อให้ผู้ใช้ระบุ frame เอง'], a:0,
   e:'If cache hit, use translation / If cache miss, walk multi-level page table ถ้าตารางหน้าระบุว่า Invalid จึงจะ Raise Exception ส่วนถ้า Valid ก็ได้ Frame มาประกอบกับ Offset เป็นที่อยู่จริง'},

  {id:'b608', c:7, q:'Segment ที่ถูกแชร์ระหว่างโปรเซสสองตัวมีลักษณะอย่างไร',
   ch:['มีจุดเริ่มและความยาวเดียวกัน แต่สิทธิ์การเข้าถึงอาจเหมือนหรือต่างกันก็ได้','ต้องมีสิทธิ์การเข้าถึงเหมือนกันเสมอ','ต้องอยู่ที่ virtual address เดียวกันเสมอ','ไม่สามารถแชร์ได้เลย'], a:0,
   e:'สไลด์ระบุว่า Processes can share segments — Same start, length, same/different access permissions เช่นโปรเซสหนึ่งอ่านได้อย่างเดียว อีกโปรเซสอ่านเขียนได้'},

  {id:'b609', c:7, q:'ข้อใดคือการใช้ Address Translation เพื่อ "Program initialization"',
   ch:['เริ่มรันโปรแกรมได้ก่อนที่โปรแกรมทั้งหมดจะถูกโหลดเข้าหน่วยความจำ','จองหน่วยความจำทั้งหมดที่โปรแกรมจะใช้ล่วงหน้า','คอมไพล์โปรแกรมขณะกำลังรัน','ตรวจสอบลายเซ็นดิจิทัลของโปรแกรม'], a:0,
   e:'สไลด์ระบุ Program initialization: Start running a program before it is entirely in memory ซึ่งทำได้เพราะการแปลที่อยู่ให้เคอร์เนล trap เมื่อมีการอ้างถึงส่วนที่ยังไม่ได้โหลด'},

  {id:'b610', c:7, q:'Page table ถูกเก็บไว้ที่ใด และฮาร์ดแวร์ต้องมีรีจิสเตอร์อะไรบ้าง',
   ch:['เก็บใน physical memory โดยมีรีจิสเตอร์ชี้ไปยังจุดเริ่มของตารางและบอกความยาวของตาราง','เก็บใน TLB โดยไม่ต้องมีรีจิสเตอร์เพิ่ม','เก็บในดิสก์ โดยมีรีจิสเตอร์เก็บชื่อไฟล์','เก็บใน cache ระดับหนึ่ง โดยมีรีจิสเตอร์เก็บ offset'], a:0,
   e:'สไลด์ระบุว่าแต่ละโปรเซสมี page table ของตัวเอง Stored in physical memory และมี Hardware registers คือ pointer to page table start และ page table length'},

  /* ===== บทที่ 8 ===== */
  {id:'b701', c:8, q:'ข้อใดคือความแตกต่างระหว่าง Write through กับ Write back',
   ch:['Write through ส่งการเปลี่ยนแปลงไปชั้นถัดไปทันที ส่วน Write back เก็บไว้ในแคชจนกว่าบล็อกจะถูกแทนที่','Write through เก็บไว้ในแคชก่อน ส่วน Write back ส่งไปทันที','ทั้งสองเขียนลงดิสก์ทันทีเหมือนกัน','Write back ใช้ได้เฉพาะกับ TLB'], a:0,
   e:'Write through: changes sent immediately to next level of storage ส่วน Write back: changes stored in cache until cache block is replaced โดยต้องรอจังหวะก่อน แล้วค่อยเขียนข้อมูลใน cache ที่เป็น dirty block กลับลง RAM'},

  {id:'b702', c:8, q:'เหตุใด LRU จึงถือเป็น approximation ของ MIN ได้ดี',
   ch:['เพราะโปรแกรมส่วนใหญ่มี spatial และ temporal locality อดีตจึงพอทำนายอนาคตได้','เพราะ LRU มองเห็นอนาคตได้เช่นเดียวกับ MIN','เพราะ LRU ใช้หน่วยความจำน้อยกว่า MIN','เพราะ LRU ไม่เกิด Belady’s Anomaly'], a:0,
   e:'Recap ระบุว่า LRU is an approximation of MIN — For programs that exhibit spatial and temporal locality เพราะหน้าที่เพิ่งใช้มักจะถูกใช้อีกเร็ว ๆ นี้'},

  {id:'b703', c:8, q:'กรณีใดที่ FIFO ให้ผลแย่ที่สุด',
   ch:['เมื่อโปรแกรมไล่อ่านหน่วยความจำเป็นช่วงที่ใหญ่กว่าขนาดของแคช','เมื่อโปรแกรมอ้างถึงหน้าเดียวซ้ำ ๆ','เมื่อแคชมีขนาดใหญ่กว่าข้อมูลทั้งหมด','เมื่อมีเพียงหนึ่งโปรเซสในระบบ'], a:0,
   e:'สไลด์ระบุว่า "Worst case for FIFO is if program strides through memory that is larger than the cache" เพราะหน้าที่เพิ่งถูกไล่ออกไปกลับเป็นหน้าที่กำลังจะถูกใช้พอดี'},

  {id:'b704', c:8, q:'ข้อใดอธิบาย Belady’s Anomaly ได้ถูกต้อง',
   ch:['เพิ่มจำนวนช่องในแคชแล้วกลับได้ hit น้อยลง','เพิ่มจำนวนช่องในแคชแล้วได้ hit มากขึ้นเสมอ','ลดจำนวนช่องแล้ว miss ลดลง','นโยบาย MIN ให้ผลแย่กว่า LRU'], a:0,
   e:'สไลด์เขียนกำกับว่า Cache↑, Hit↓ พร้อมตัวอย่าง FIFO 3 ช่องได้ 3 hit แต่ FIFO 4 ช่องได้เพียง 2 hit ซึ่งขัดกับสามัญสำนึก'},

  {id:'b705', c:8, q:'ขั้นตอนใดเกิดขึ้นก่อนในลำดับของ Demand Paging',
   ch:['TLB miss แล้วจึง Page table walk แล้วจึง Page fault','Page fault แล้วจึง TLB miss','Trap to kernel แล้วจึง TLB miss','Disk interrupt แล้วจึง Page fault'], a:0,
   e:'ลำดับคือ 1) TLB miss 2) Page table walk 3) Page fault (page invalid in page table) 4) Trap to kernel 5) แปลที่อยู่เสมือนเป็นไฟล์+offset 6) จัดสรร page frame 7) อ่านบล็อกจากดิสก์ 8) Disk interrupt เมื่อ DMA เสร็จ 9) mark valid 10) resume 11) TLB miss 12) page table walk 13) execute'},

  {id:'b706', c:8, q:'ขั้นตอนใดใน Demand Paging ที่ทำงานอยู่ใน kernel mode',
   ch:['ตั้งแต่ Trap to kernel จนถึง Initiate disk block read into page frame','ตั้งแต่ TLB miss จนถึง Page table walk','ตั้งแต่ Resume process จนถึง Execute instruction','เฉพาะขั้นตอน Execute instruction'], a:0,
   e:'โน้ตในสไลด์วงกรอบ kernel mode ไว้ที่ขั้นตอน 4–7 คือ trap to kernel, แปลที่อยู่เป็นไฟล์+offset, จัดสรร page frame (พร้อม evict ถ้าจำเป็น) และเริ่มอ่านบล็อกจากดิสก์'},

  {id:'b707', c:8, q:'ในขั้นตอน Allocating a Page Frame ข้อใดคือสิ่งที่ต้องทำกับหน้าที่ถูกเลือกไล่ออก',
   ch:['ตั้ง page table entry ทั้งหมดที่ชี้ไปยังหน้านั้นให้เป็น invalid ลบ TLB entry และเขียนกลับลงดิสก์ถ้าจำเป็น','ลบหน้านั้นออกจากดิสก์','คัดลอกหน้านั้นไปยัง TLB','เพิ่มลำดับความสำคัญของโปรเซสเจ้าของหน้านั้น'], a:0,
   e:'ขั้นตอนคือ: เลือกหน้าเก่าที่จะไล่ออก, หา page table entry ทั้งหมดที่อ้างถึงหน้านั้น (กรณีแชร์ frame), ตั้งแต่ละ entry เป็น invalid, ลบ TLB entry ที่เป็นสำเนาของ entry ที่ invalid แล้ว, และเขียนการเปลี่ยนแปลงกลับลงดิสก์ถ้าจำเป็น'},

  {id:'b708', c:8, q:'Dirty bit ถูกตั้งค่าเมื่อใด และโดยใคร',
   ch:['ถูกตั้งโดยฮาร์ดแวร์เมื่อมีคำสั่ง store เขียนลงหน้านั้น','ถูกตั้งโดยเคอร์เนลเมื่อหน้าถูกโหลดเข้าหน่วยความจำ','ถูกตั้งโดยฮาร์ดแวร์ทุกครั้งที่เกิด TLB miss','ถูกตั้งโดยโปรแกรมผู้ใช้ผ่าน system call'], a:0,
   e:'Has page been modified? — Set by hardware on store instruction, In both TLB and page table entry ส่วนบิตที่ถูกตั้งทุกครั้งที่เกิด TLB miss คือ use bit (recently used) ซึ่งเคอร์เนลสามารถ reset ได้'},

  {id:'b709', c:8, q:'หน้าทางกายภาพ (Physical page) จะถือว่า "ถูกแก้ไขแล้ว" เมื่อใด',
   ch:['เมื่อมี page table entry ใดก็ตามที่ชี้มาหามันถูกแก้ไข','เมื่อทุก page table entry ที่ชี้มาหามันถูกแก้ไข','เมื่อมันถูกเขียนลงดิสก์แล้ว','เมื่อมันถูกโหลดเข้า TLB'], a:0,
   e:'สไลด์ระบุว่า Physical page is Modified if any page table entry that points to it is modified และ Recently used if any page table entry that points to it is recently used'},

  {id:'b710', c:8, q:'บนสถาปัตยกรรม MIPS บิต dirty/use ถูกเก็บไว้ที่ใด',
   ch:['ใน core map ซึ่งเป็นแผนที่ของ page frame ทางกายภาพ','ใน page table entry เท่านั้น','ใน TLB เท่านั้น','ในดิสก์'], a:0,
   e:'เครื่องส่วนใหญ่เก็บ dirty/use bits ไว้ใน page table entry แต่สไลด์ระบุว่า "On MIPS, simpler to keep dirty/use bits in the core map" ซึ่ง core map คือ map of physical page frames'},

  {id:'b711', c:8, q:'ข้อใดคือข้อดีของ Memory-mapped files เมื่อเทียบกับ Explicit read/write system calls',
   ch:['ทำงานกับไฟล์ได้โดยตรงแทนการคัดลอกเข้าออก ทำให้ได้ zero-copy I/O และเริ่มทำงานได้ก่อนหน้าทั้งหมดถูกเติมครบ','รับประกันว่าไม่เกิด page fault เลย','ไม่ต้องใช้ตารางหน้า','ทำให้ไฟล์มีขนาดเล็กลง'], a:0,
   e:'ข้อดีคือ Programming simplicity (โดยเฉพาะไฟล์ใหญ่), Zero-copy I/O, Pipelining (เริ่มทำงานได้ก่อนทุกหน้าถูกเติม) และใช้สื่อสารระหว่างโปรเซสได้ ส่วน page fault ยังเกิดเมื่อส่วนของไฟล์ยังไม่อยู่ในหน่วยความจำ'},

  {id:'b712', c:8, q:'หลัง fork แล้วใช้ Copy-on-write เมื่อฝ่ายหนึ่งต้องการเขียนลงหน้าที่แชร์กันอยู่ จะเกิดอะไรขึ้น',
   ch:['เกิด exception แล้วระบบจึงคัดลอกหน้านั้นให้ก่อน จากนั้นจึงอัปเดตได้','ระบบยอมให้เขียนทับทันทีโดยไม่ทำอะไรเพิ่ม','โปรเซสลูกถูกยกเลิก','หน้านั้นถูกเขียนลงดิสก์แล้วลบออกจากหน่วยความจำ'], a:0,
   e:'หลัง fork หน้าถูกแชร์แบบอ่านอย่างเดียว เมื่อมีการ W ลงไป จะเกิด exception แล้วจึงค่อย copy หน้านั้นออกมาให้เป็นของตัวเอง จากนั้นจึง update ได้ ข้อดีคือ Ready เร็วขึ้นและประหยัด RAM'},

  {id:'b713', c:8, q:'ข้อใดคือข้อดีของ Fill on reference',
   ch:['พร้อมรันเร็วขึ้นและประหยัด RAM เพราะโหลดเฉพาะส่วนที่ถูกอ้างถึง','รับประกันว่าโปรแกรมทั้งหมดอยู่ใน RAM ตลอดเวลา','ทำให้ไม่ต้องใช้ address translation','ทำให้ขนาดของไฟล์ปฏิบัติการเล็กลง'], a:0,
   e:'Fill on reference ไม่โหลดทุกอย่างเข้า RAM ทันที แต่โหลดฟังก์ชันที่ต้องใช้เมื่อถูกอ้างถึง ทำให้ Ready เร็วขึ้นและประหยัด RAM โดยอาศัย address translation, pages, memory mapped file และ zero copy I/O'},

  {id:'b714', c:8, q:'ตามตาราง Memory Hierarchy ข้อใดเรียงลำดับ Hit Cost จากน้อยไปมากได้ถูกต้อง',
   ch:['1st level cache → 3rd level cache → Memory (DRAM) → Local disk','Memory (DRAM) → 1st level cache → Local disk → 3rd level cache','Local disk → Memory (DRAM) → 3rd level cache → 1st level cache','3rd level cache → 1st level cache → Local disk → Memory (DRAM)'], a:0,
   e:'จากตาราง: 1st level cache 1 ns, 2nd level 4 ns, 3rd level 12 ns, Memory (DRAM) 100 ns, Data center DRAM/Local non-volatile 100 μs, Local disk และ Data center disk 10 ms, Remote data center disk 200 ms'},

  {id:'b715', c:8, q:'กราฟ Cache hit rate ที่พล็อตเทียบกับ Cache Size แสดงพฤติกรรมอย่างไร',
   ch:['hit rate เพิ่มขึ้นอย่างรวดเร็วตอนแรก แล้วค่อย ๆ อิ่มตัวเมื่อแคชใหญ่ขึ้น','hit rate เพิ่มขึ้นเป็นเส้นตรงตลอด','hit rate ลดลงเมื่อแคชใหญ่ขึ้น','hit rate คงที่ไม่ว่าแคชจะใหญ่แค่ไหน'], a:0,
   e:'กราฟมีรูปทรงอิ่มตัว (diminishing returns) คือเพิ่มขนาดแคชช่วงแรกได้ hit rate เพิ่มเยอะ แต่พอใหญ่ถึงจุดหนึ่งแล้วการเพิ่มขนาดก็แทบไม่ช่วยอีก'},

  {id:'b716', c:8, q:'เป้าหมายของ Cache Replacement Policy คืออะไร',
   ch:['ลดจำนวน cache miss เพื่อปรับปรุงประสิทธิภาพกรณีคาดหวัง และลดโอกาสที่ประสิทธิภาพจะแย่มาก','เพิ่มจำนวน cache miss เพื่อให้ข้อมูลสดใหม่','ลดขนาดของแคชให้เล็กที่สุด','ทำให้ทุกการเข้าถึงเป็น write through'], a:0,
   e:'Policy goal: reduce cache misses — Improve expected case performance และ Also: reduce likelihood of very poor performance สไลด์ยังระบุว่าใน direct mapped caches ไม่ต้องเลือกเพราะมีที่ให้ลงได้ที่เดียว'},
];
