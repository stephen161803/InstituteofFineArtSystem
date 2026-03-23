import svgPaths from "./svg-dh8fahrk4q";
import imgImageWithFallback from "figma:asset/36480e3aedbbf627a3da7449b7f633e9e5c4d0d3.png";
import imgImageWithFallback1 from "figma:asset/6d3593b3c1bc10d3ea61ba8d679b19a1243decb3.png";
import imgImageWithFallback2 from "figma:asset/9ab3aaaf7af59dace71488dce38c9ca340e3b895.png";

function Icon() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[70.83%] left-[54.17%] right-[41.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2d636f80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[54.17%] left-[70.83%] right-1/4 top-[41.67%]" data-name="Vector">
        <div className="absolute inset-[-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2d636f80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_62.5%_66.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2d636f80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/4 right-[70.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2d636f80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_8.37%_8.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.992 22">
            <path d={svgPaths.p333cc080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[40px]" data-name="Header" style={{ backgroundImage: "linear-gradient(135deg, rgb(152, 16, 250) 0%, rgb(21, 93, 252) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-1.6px] whitespace-nowrap">Institute of Fine Arts</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[15.994px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#4a5565] text-[12px]">Viện Mỹ Thuật</p>
    </div>
  );
}

function Header2() {
  return (
    <div className="flex-[1_0_0] h-[43.994px] min-h-px min-w-px relative" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[43.994px] relative shrink-0 w-[241.438px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Header1 />
        <Header2 />
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[60.425px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">Trang chủ</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[56.031px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">Triển lãm</p>
      </div>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="bg-[#030213] h-[32px] relative rounded-[8px] shrink-0 w-[93.869px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Đăng nhập</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[32px] relative shrink-0 w-[258.325px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Link1 />
        <Link2 />
        <SlotClone />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[43.994px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Link />
      <Navigation />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[76.794px] items-start left-0 pb-[0.8px] pt-[16px] px-[79px] top-0 w-[1150px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[96px] left-0 top-0 w-[768px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[48px] left-0 not-italic text-[48px] text-white top-[-3px] w-[700px]">Welcome to the Institute of Fine Arts</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[56px] left-0 top-[112px] w-[768px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[#f3e8ff] text-[20px] top-[-1.6px] w-[702px]">Specialized training in painting, design, and animation. Discover your talent and develop your art with us.</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[91.28px] size-[20px] top-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="absolute bg-[#eceef2] h-[40px] left-0 rounded-[8px] top-0 w-[127.275px]" data-name="SlotClone">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[16px] not-italic text-[#030213] text-[14px] top-[9.4px] whitespace-nowrap">Join Now</p>
      <Icon1 />
    </div>
  );
}

function SlotClone2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex h-[40px] items-center justify-center left-[143.28px] px-[24.8px] py-[0.8px] rounded-[8px] top-0 w-[147.519px]" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">View Exhibition</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[40px] left-0 top-[200px] w-[768px]" data-name="Container">
      <SlotClone1 />
      <SlotClone2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[240px] relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Paragraph1 />
      <Container2 />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex flex-col from-[#9810fa] h-[400px] items-start left-0 pl-[79px] pr-[303px] pt-[80px] to-[#155dfc] top-[76.79px] w-[1150px]" data-name="Section">
      <Container1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p371e6400} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-1px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 2">
            <path d="M1 1H19" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomePage1() {
  return (
    <div className="absolute bg-[#f3e8ff] content-stretch flex flex-col h-[40px] items-start left-[24px] pl-[8px] pr-[148.4px] pt-[8px] rounded-[10px] top-[24px] w-[180.4px]" data-name="HomePage">
      <Icon2 />
    </div>
  );
}

function CardDescription() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Contests</p>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="content-stretch flex h-[31.994px] items-start relative shrink-0 w-full" data-name="CardTitle">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[32px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[24px]">12</p>
    </div>
  );
}

function HomePage2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.994px] items-start left-[24px] top-[76px] w-[180.4px]" data-name="HomePage">
      <CardDescription />
      <CardTitle />
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[143.994px] relative shrink-0 w-[228.4px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <HomePage1 />
        <HomePage2 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-1 h-[145.594px] justify-self-stretch relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start p-[0.8px] relative size-full">
        <CardHeader />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 8">
            <path d={svgPaths.p11b86180} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.pb08b100} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
        <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.00024 7.87024">
            <path d={svgPaths.p19976900} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.04%_20.8%_54.67%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-12.91%_-33.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.00808 9.75048">
            <path d={svgPaths.p29500900} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomePage3() {
  return (
    <div className="absolute bg-[#dbeafe] content-stretch flex flex-col h-[40px] items-start left-[24px] pl-[8px] pr-[148.4px] pt-[8px] rounded-[10px] top-[24px] w-[180.4px]" data-name="HomePage">
      <Icon3 />
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Students</p>
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="content-stretch flex h-[31.994px] items-start relative shrink-0 w-full" data-name="CardTitle">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[32px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[24px]">356</p>
    </div>
  );
}

function HomePage4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.994px] items-start left-[24px] top-[76px] w-[180.4px]" data-name="HomePage">
      <CardDescription1 />
      <CardTitle1 />
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="h-[143.994px] relative shrink-0 w-[228.4px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <HomePage3 />
        <HomePage4 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-2 h-[145.594px] justify-self-stretch relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start p-[0.8px] relative size-full">
        <CardHeader1 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 8">
            <path d={svgPaths.p33de8640} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_29.17%_66.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-20%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
            <path d="M11 6L6 1L1 6" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[37.5%] left-1/2 right-1/2 top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 14">
            <path d="M1 1V13" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomePage5() {
  return (
    <div className="absolute bg-[#dcfce7] content-stretch flex flex-col h-[40px] items-start left-[24px] pl-[8px] pr-[148.4px] pt-[8px] rounded-[10px] top-[24px] w-[180.4px]" data-name="HomePage">
      <Icon4 />
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Submissions</p>
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="content-stretch flex h-[31.994px] items-start relative shrink-0 w-full" data-name="CardTitle">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[32px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[24px]">85</p>
    </div>
  );
}

function HomePage6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.994px] items-start left-[24px] top-[76px] w-[180.4px]" data-name="HomePage">
      <CardDescription2 />
      <CardTitle2 />
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="h-[143.994px] relative shrink-0 w-[228.4px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <HomePage5 />
        <HomePage6 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-3 content-stretch flex flex-col h-[145.594px] items-start justify-self-stretch p-[0.8px] relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader2 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[62.5%] left-[8.33%] right-3/4 top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-20%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
            <path d={svgPaths.p35718680} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[62.5%] left-3/4 right-[8.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-20%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
            <path d={svgPaths.p3740aa40} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[91.67%_16.67%_8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-1px_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 2">
            <path d="M1 1H17" id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[61.08%_58.33%_8.33%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-13.62%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9.34">
            <path d={svgPaths.p2c0d1c00} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[61.08%_29.17%_8.33%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-13.62%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 9.34">
            <path d={svgPaths.p32899100} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
            <path d={svgPaths.p10f98780} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomePage7() {
  return (
    <div className="absolute bg-[#ffedd4] content-stretch flex flex-col h-[40px] items-start left-[24px] pl-[8px] pr-[148.4px] pt-[8px] rounded-[10px] top-[24px] w-[180.4px]" data-name="HomePage">
      <Icon5 />
    </div>
  );
}

function CardDescription3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Awards</p>
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="content-stretch flex h-[31.994px] items-start relative shrink-0 w-full" data-name="CardTitle">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[32px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[24px]">48</p>
    </div>
  );
}

function HomePage8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.994px] items-start left-[24px] top-[76px] w-[180.4px]" data-name="HomePage">
      <CardDescription3 />
      <CardTitle3 />
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="h-[143.994px] relative shrink-0 w-[228.4px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <HomePage7 />
        <HomePage8 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-4 content-stretch flex flex-col h-[145.594px] items-start justify-self-stretch p-[0.8px] relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader3 />
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute bg-white gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[273.594px] left-0 px-[79px] py-[64px] top-[476.79px] w-[1150px]" data-name="Section">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-[-2px] whitespace-nowrap">Active Contests</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-1.8px] whitespace-nowrap">Join now to showcase your talent</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[68px] relative shrink-0 w-[234.206px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading2 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[757.794px] relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="h-[176.094px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function HomePage9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[176.094px] items-start left-0 overflow-clip top-0 w-[313.063px]" data-name="HomePage">
      <ImageWithFallback />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="h-[56px] relative shrink-0 w-[191.625px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] w-[126px]">Spring Painting Contest 2026</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#030213] h-[21.594px] relative rounded-[8px] shrink-0 w-[65.438px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Ongoing</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage10() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-start justify-between left-[24px] top-[24px] w-[265.063px]" data-name="HomePage">
      <CardTitle4 />
      <Badge />
    </div>
  );
}

function CardDescription4() {
  return (
    <div className="absolute h-[48px] left-[24px] overflow-clip top-[94px] w-[265.063px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] w-[246px]">Theme: Spring Colors - Express the beauty of spring through your personal perspective</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[142px] left-0 top-[200.09px] w-[313.063px]" data-name="CardHeader">
      <HomePage10 />
      <CardDescription4 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.569px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Deadline:</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.981px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">17 days left</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.419px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Submissions:</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">45</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32.788px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Prize:</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.013px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#9810fa] text-[14px] top-[-0.6px] whitespace-nowrap">$20,000</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <Text5 />
    </div>
  );
}

function SlotClone3() {
  return (
    <div className="bg-[#030213] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SlotClone">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[93.68px] not-italic text-[14px] text-white top-[7.4px] whitespace-nowrap">View Details</p>
    </div>
  );
}

function HomePage11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[132px] items-start left-[24px] top-[366.09px] w-[265.063px]" data-name="HomePage">
      <Container6 />
      <Container7 />
      <Container8 />
      <SlotClone3 />
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[523.7px] left-0 overflow-clip rounded-[14px] top-0 w-[314.663px]" data-name="Card">
      <HomePage9 />
      <CardHeader4 />
      <HomePage11 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="h-[176.1px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function HomePage12() {
  return (
    <div className="absolute content-stretch flex flex-col h-[176.1px] items-start left-0 overflow-clip top-0 w-[313.069px]" data-name="HomePage">
      <ImageWithFallback1 />
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="h-[56px] relative shrink-0 w-[182.994px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] w-[157px]">Creative Animation Contest 2026</p>
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#eceef2] h-[21.594px] relative rounded-[8px] shrink-0 w-[74.075px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] whitespace-nowrap">Upcoming</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage13() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-start justify-between left-[24px] top-[24px] w-[265.069px]" data-name="HomePage">
      <CardTitle5 />
      <Badge1 />
    </div>
  );
}

function CardDescription5() {
  return (
    <div className="absolute h-[48px] left-[24px] overflow-clip top-[94px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] w-[254px]">Design original animated characters with creative stories</p>
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="absolute h-[142px] left-0 top-[200.1px] w-[313.069px]" data-name="CardHeader">
      <HomePage13 />
      <CardDescription5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.569px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Deadline:</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.388px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">38 days left</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text6 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.419px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Submissions:</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.55px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">28</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32.788px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Prize:</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[47.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#9810fa] text-[14px] top-[-0.6px] whitespace-nowrap">$15,000</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Text11 />
    </div>
  );
}

function SlotClone4() {
  return (
    <div className="bg-[#030213] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SlotClone">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[93.68px] not-italic text-[14px] text-white top-[7.4px] whitespace-nowrap">View Details</p>
    </div>
  );
}

function HomePage14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[132px] items-start left-[24px] top-[366.1px] w-[265.069px]" data-name="HomePage">
      <Container9 />
      <Container10 />
      <Container11 />
      <SlotClone4 />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[523.7px] left-[338.66px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <HomePage12 />
      <CardHeader5 />
      <HomePage14 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="h-[176.1px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function HomePage15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[176.1px] items-start left-0 overflow-clip top-0 w-[313.069px]" data-name="HomePage">
      <ImageWithFallback2 />
    </div>
  );
}

function CardTitle6() {
  return (
    <div className="h-[56px] relative shrink-0 w-[182.994px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] w-[158px]">Landscape Painting Contest</p>
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#eceef2] h-[21.594px] relative rounded-[8px] shrink-0 w-[74.075px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] whitespace-nowrap">Upcoming</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage16() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-start justify-between left-[24px] top-[24px] w-[265.069px]" data-name="HomePage">
      <CardTitle6 />
      <Badge2 />
    </div>
  );
}

function CardDescription6() {
  return (
    <div className="absolute h-[48px] left-[24px] overflow-clip top-[94px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] w-[215px]">Capture beautiful landscapes - Celebrating natural beauty</p>
    </div>
  );
}

function CardHeader6() {
  return (
    <div className="absolute h-[142px] left-0 top-[200.1px] w-[313.069px]" data-name="CardHeader">
      <HomePage16 />
      <CardDescription6 />
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.569px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Deadline:</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.681px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">54 days left</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text12 />
          <Text13 />
        </div>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.419px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Submissions:</p>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[13.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.6px] whitespace-nowrap">12</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text14 />
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32.788px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Prize:</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[47.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#9810fa] text-[14px] top-[-0.6px] whitespace-nowrap">$18,000</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text16 />
          <Text17 />
        </div>
      </div>
    </div>
  );
}

function SlotClone5() {
  return (
    <div className="bg-[#030213] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SlotClone">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[93.67px] not-italic text-[14px] text-white top-[7.4px] whitespace-nowrap">View Details</p>
    </div>
  );
}

function HomePage17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[132px] items-start left-[24px] top-[366.1px] w-[265.069px]" data-name="HomePage">
      <Container12 />
      <Container13 />
      <Container14 />
      <SlotClone5 />
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[523.7px] left-[677.33px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <HomePage15 />
      <CardHeader6 />
      <HomePage17 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[523.7px] relative shrink-0 w-full" data-name="Container">
      <Card4 />
      <Card5 />
      <Card6 />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[623.7px] items-start left-[63px] px-[16px] top-[814.39px] w-[1024px]" data-name="Section">
      <Container3 />
      <Container5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[53.71%_29.17%_8.34%_29.18%]" data-name="Vector">
        <div className="absolute inset-[-10.98%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9968 11.1095">
            <path d={svgPaths.p3d70580} id="Vector" stroke="var(--stroke-0, #D08700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d={svgPaths.p31e16900} id="Vector" stroke="var(--stroke-0, #D08700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#fef9c2] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-[-2px] whitespace-nowrap">Award-Winning Students</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-1.8px] whitespace-nowrap">Outstanding talents of the Institute</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[60px] relative shrink-0 w-[341.631px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[12px] h-[60px] items-center relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="h-[313.063px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function HomePage18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip size-[313.063px] top-0" data-name="HomePage">
      <ImageWithFallback3 />
    </div>
  );
}

function CardTitle7() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Nguyen Minh Anh</p>
    </div>
  );
}

function CardDescription7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[-0.6px] whitespace-nowrap">Breath of Winter</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <CardTitle7 />
        <CardDescription7 />
      </div>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#fefce8] h-[21.594px] relative rounded-[8px] shrink-0 w-[70.631px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a65f00] text-[12px] whitespace-nowrap">First Prize</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fff085] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage19() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[265.063px]" data-name="HomePage">
      <Container19 />
      <Badge3 />
    </div>
  );
}

function CardHeader7() {
  return (
    <div className="absolute h-[78px] left-0 top-[337.06px] w-[313.063px]" data-name="CardHeader">
      <HomePage19 />
    </div>
  );
}

function HomePage20() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[439.06px] w-[265.063px]" data-name="HomePage">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Winter Painting Contest 2025</p>
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[484.669px] left-0 overflow-clip rounded-[14px] top-0 w-[314.663px]" data-name="Card">
      <HomePage18 />
      <CardHeader7 />
      <HomePage20 />
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="h-[313.069px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function HomePage21() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip size-[313.069px] top-0" data-name="HomePage">
      <ImageWithFallback4 />
    </div>
  );
}

function CardTitle8() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Tran Hoang Nam</p>
    </div>
  );
}

function CardDescription8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[-0.6px] whitespace-nowrap">Digital Future</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <CardTitle8 />
        <CardDescription8 />
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#fefce8] h-[21.594px] relative rounded-[8px] shrink-0 w-[87.388px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a65f00] text-[12px] whitespace-nowrap">Second Prize</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fff085] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage22() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[265.069px]" data-name="HomePage">
      <Container20 />
      <Badge4 />
    </div>
  );
}

function CardHeader8() {
  return (
    <div className="absolute h-[78px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <HomePage22 />
    </div>
  );
}

function HomePage23() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[439.07px] w-[265.069px]" data-name="HomePage">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Design Contest 2025</p>
    </div>
  );
}

function Card8() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[484.669px] left-[338.66px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <HomePage21 />
      <CardHeader8 />
      <HomePage23 />
    </div>
  );
}

function ImageWithFallback5() {
  return (
    <div className="h-[313.069px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function HomePage24() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip size-[313.069px] top-0" data-name="HomePage">
      <ImageWithFallback5 />
    </div>
  );
}

function CardTitle9() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Pham Thu Ha</p>
    </div>
  );
}

function CardDescription9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[-0.6px] whitespace-nowrap">Dream World</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <CardTitle9 />
        <CardDescription9 />
      </div>
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-[#fefce8] h-[21.594px] relative rounded-[8px] shrink-0 w-[75.744px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a65f00] text-[12px] whitespace-nowrap">Third Prize</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#fff085] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function HomePage25() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[265.069px]" data-name="HomePage">
      <Container21 />
      <Badge5 />
    </div>
  );
}

function CardHeader9() {
  return (
    <div className="absolute h-[78px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <HomePage25 />
    </div>
  );
}

function HomePage26() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[439.07px] w-[265.069px]" data-name="HomePage">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Animation Contest 2025</p>
    </div>
  );
}

function Card9() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[484.669px] left-[677.33px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <HomePage24 />
      <CardHeader9 />
      <HomePage26 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[484.669px] relative shrink-0 w-full" data-name="Container">
      <Card7 />
      <Card8 />
      <Card9 />
    </div>
  );
}

function Section3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[32px] h-[704.669px] items-start left-0 pt-[64px] px-[79px] top-[1502.09px] w-[1150px]" data-name="Section">
      <Container15 />
      <Container18 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[36px] left-[16px] top-0 w-[992px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-[496.19px] not-italic text-[30px] text-center text-white top-[-2px] whitespace-nowrap">Ready to Join Us?</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[28px] left-[176px] top-[52px] w-[672px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[335.57px] not-italic text-[#f3e8ff] text-[20px] text-center top-[-1.6px] whitespace-nowrap">Sign in to join contests, view results, and manage your artworks</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[109.52px] size-[20px] top-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone6() {
  return (
    <div className="absolute bg-[#eceef2] h-[40px] left-[439.24px] rounded-[8px] top-[112px] w-[145.525px]" data-name="SlotClone">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[55px] not-italic text-[#030213] text-[14px] text-center top-[9.4px] whitespace-nowrap">Sign In Now</p>
      <Icon7 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[152px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Paragraph4 />
      <SlotClone6 />
    </div>
  );
}

function Section4() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex flex-col from-[#9810fa] h-[280px] items-start left-0 pt-[64px] px-[63px] to-[#155dfc] top-[2206.76px] w-[1150px]" data-name="Section">
      <Container22 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.8px] whitespace-nowrap">Institute of Fine Arts</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#d1d5dc] text-[14px] top-[-0.6px] w-[289px]">Specialized training institution for fine arts and animation, committed to providing the best quality education.</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-0 top-0 w-[309.331px]" data-name="Container">
      <Heading5 />
      <Paragraph5 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.8px] whitespace-nowrap">Quick Links</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#d1d5dc] text-[14px] top-[-0.6px] whitespace-nowrap">Home</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#d1d5dc] text-[14px] top-[-0.6px] whitespace-nowrap">Exhibition</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#d1d5dc] text-[14px] top-[-0.6px] whitespace-nowrap">Sign In</p>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-[341.33px] top-0 w-[309.331px]" data-name="Container">
      <Heading6 />
      <List />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.8px] whitespace-nowrap">Contact</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="font-['Inter:Regular',sans-serif] font-normal h-[40px] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] w-full whitespace-nowrap" data-name="Paragraph">
      <p className="absolute left-0 top-[-0.6px]">Email: contact@ifa.edu</p>
      <p className="absolute left-0 top-[19.4px]">Phone: (1) 123 456 789</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-[682.66px] top-0 w-[309.331px]" data-name="Container">
      <Heading7 />
      <Paragraph6 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[116px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[495.99px] not-italic text-[#d1d5dc] text-[14px] text-center top-[-0.6px] whitespace-nowrap">© 2026 Institute of Fine Arts. All rights reserved.</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col h-[52.8px] items-start pt-[32.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <Paragraph7 />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex flex-col gap-[32px] h-[200.8px] items-start left-[63px] px-[16px] top-[2534.76px] w-[1024px]" data-name="Footer">
      <Container23 />
      <Container27 />
    </div>
  );
}

function HomePage() {
  return (
    <div className="absolute bg-[#f9fafb] h-[2783.556px] left-0 top-0 w-[1150px]" data-name="HomePage">
      <Header />
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
    </div>
  );
}

function Section5() {
  return <div className="absolute h-0 left-0 top-[2783.56px] w-[1150px]" data-name="Section" />;
}

export default function UiDesign() {
  return (
    <div className="bg-white relative size-full" data-name="UI Design">
      <HomePage />
      <Section5 />
    </div>
  );
}