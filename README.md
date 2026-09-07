# CrochetStudio

**ชื่อโครงการ:** CrochetStudio (คลังความรู้)
**คำอธิบาย:** เว็บไซต์รวบรวมบทความและคลังความรู้เกี่ยวกับการถักนิตติ้งและโครเชต์ ออกแบบมาให้ใช้งานง่ายและให้ความรู้สึกอบอุ่น

**Live Website:** [https://kk2045.github.io/final/]

**Figma Design:** [https://www.figma.com/proto/TXwJ15iFdhaCF7hQUuZBZq/%22CrochetStudio_%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%A3%E0%B8%B9%E0%B9%89?node-id=1-2]

## Project Objectives
- **วัตถุประสงค์:** เพื่อสร้างคลังความรู้ออนไลน์ที่เข้าถึงได้ง่าย สำหรับผู้ที่สนใจงานฝีมือ (นิตติ้งและโครเชต์) โดยแปลงจากดีไซน์ต้นแบบใน Figma ให้เป็นเว็บไซต์ที่ใช้งานได้จริง
- **กลุ่มเป้าหมาย:** ผู้เริ่มต้นและผู้ที่สนใจงานประดิษฐ์ งานฝีมือ การถักไหมพรม ที่ต้องการค้นหาบทความและเทคนิคต่างๆ

## Technology Stack
- **Design:** Figma
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **CSS / UI:** เขียน CSS เองทั้งหมด (Vanilla CSS) พร้อมการใช้ CSS Variables สำหรับควบคุมสีและธีม
- **Framework:** ไม่ใช้ Framework เพื่อเน้นพื้นฐานที่แข็งแกร่ง
- **Build Tool:** ไม่มี (Static HTML)
- **Assets:** Google Fonts (Prompt), Font Awesome (Icons), AI-Generated Placeholder Images
- **Version Control:** Git และ GitHub
- **Hosting:** [GitHub Pages]
- **AI Tools:** Gemini 3.1 Pro (สำหรับช่วยเขียนโค้ดโครงสร้างและสร้างรูปภาพ)

## Features
- หน้ารวมคลังความรู้พร้อมระบบแสดงบทความ
- ระบบกรองหมวดหมู่ (ทั้งหมด, ถักนิตติ้ง, โครเชต์ ฯลฯ)
- ระบบค้นหาบทความ (Mockup Filter)
- หน้าอ่านรายละเอียดบทความ (Article Detail)
- เมนูแบบ Responsive (Hamburger Menu) บนมือถือ

## Design Implementation
- **Layout:** นำโครงสร้างการจัดวางมาจาก Figma โดยใช้ CSS Flexbox และ CSS Grid เพื่อให้จัดวางบทความได้สวยงาม
- **Color:** ใช้โทนสีอบอุ่นตามต้นฉบับ เช่น สีน้ำตาล (#a47c73) สีครีม (#fcfbf9) เพื่อให้สอดคล้องกับงานฝีมือ
- **Typography:** ใช้ฟอนต์ Prompt จาก Google Fonts ให้ตรงกับงานดีไซน์ต้นฉบับ
- **Components:** สร้าง Card บทความ, ปุ่มค้นหา, ปุ่มหมวดหมู่ ให้มี Interaction เมื่อชี้เมาส์ (Hover effects)

## Responsive Design
- **Breakpoint:** ใช้ Media Queries ที่ `992px`, `768px` และ `576px`
- **การปรับ Layout:** ในหน้าจอ Mobile จะซ่อนเมนูหลักและแสดงเป็น Hamburger Icon, ปรับ Hero Banner ให้มีขนาดเล็กลง, และเปลี่ยน Grid ของบทความให้แสดงผลเป็นคอลัมน์เดียว

## AI Usage Report
- **เครื่องมือ AI:** Gemini 3.1 Pro (Advanced Agentic Coding)
- **ขั้นตอนที่ใช้:** ใช้ในการขึ้นโครงร่างไฟล์ HTML/CSS เบื้องต้น และการสร้างรูปภาพประกอบ (Placeholder) เพื่อให้เว็บไซต์ดูสมจริง
- **Prompt สำคัญ:** 
  1. `A cozy, aesthetic and warm composition of various balls of yarn...` (สำหรับสร้าง Hero Banner)
  2. `Close up shot of hands knitting with beige yarn...` (สำหรับรูปภาพบทความ 1)
  3. `สร้างไฟล์ index.html และ css/style.css โดยมีโครงสร้างตรงตามภาพจาก Figma...` (ใช้เพื่อขึ้นโครงสร้างโค้ด)
- **การแก้ไขผลลัพธ์:** ได้ทำการปรับแก้ CSS Variables สี และระยะห่าง (Margin/Padding) ในไฟล์ `style.css` ให้ตรงกับ Layout มากที่สุดด้วยตัวเอง รวมถึงเขียน JavaScript ของระบบ Filter และ Mobile Menu ใหม่

## Deployment
- **Hosting:** [GitHub Pages]
- **ขั้นตอน:**
  1. สร้าง Repository บน GitHub
  2. Push code (HTML, CSS, JS, Images) ขึ้น Repository
  3. ตั้งค่า Pages ใน Settings GitHub Pages
  4. สั่ง Deploy และรับ URL สาธารณะ

## Challenges
- **ปัญหาที่พบ:** การดัดแปลงดีไซน์จากหน้าจอมือถือ/Desktop ใน Figma ให้แสดงผลได้ดีในทุกขนาดหน้าจอ
- **แนวทางแก้:** ใช้ Flexbox ควบคู่กับ Grid และทดสอบการแสดงผลบน Chrome DevTools ในโหมด Responsive หลายๆ ขนาด
- **สิ่งที่เรียนรู้:** การประยุกต์ใช้ Vanilla JS ในการทำระบบ Filter ข้อมูลโดยไม่ต้องพึ่งพา Library เพิ่มเติม

## Author
- **ชื่อ-นามสกุล:** [ใส่ชื่อ-นามสกุลของคุณ]
- **รหัสนักศึกษา:** [ใส่รหัสนักศึกษาของคุณ]
