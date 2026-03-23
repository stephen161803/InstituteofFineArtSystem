import svgPaths from "./svg-flr4j9s50v";
import imgImageWithFallback from "figma:asset/36480e3aedbbf627a3da7449b7f633e9e5c4d0d3.png";
import imgImageWithFallback1 from "figma:asset/6d3593b3c1bc10d3ea61ba8d679b19a1243decb3.png";
import imgImageWithFallback2 from "figma:asset/9ab3aaaf7af59dace71488dce38c9ca340e3b895.png";
import imgImageWithFallback3 from "figma:asset/8fbb120e35214159bc7f164a1b64c85e7b389000.png";
import imgImageWithFallback4 from "figma:asset/2669f596d56fe294549cdb86cd180c53add9f893.png";
import imgImageWithFallback5 from "figma:asset/630e11e0ba0be9d2e41bc195533dcfb5ca3a0117.png";

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
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[40px] left-0 not-italic text-[36px] text-white top-[-2px] whitespace-nowrap">Triển lãm Nghệ thuật</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[#f3e8ff] text-[20px] top-[-1.6px] whitespace-nowrap">Khám phá và sở hữu các tác phẩm nghệ thuật xuất sắc của sinh viên</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[84px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex flex-col from-[#9810fa] h-[212px] items-start left-0 pt-[64px] px-[63px] to-[#155dfc] top-[76.79px] w-[1150px]" data-name="Container">
      <Container2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-[-2px] whitespace-nowrap">Các triển lãm</p>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[16px] relative shrink-0 w-[182.856px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-1.8px] whitespace-nowrap">Triển lãm Mùa xuân 2026</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#030213] h-[21.594px] relative rounded-[8px] shrink-0 w-[87.75px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Đang diễn ra</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery1() {
  return (
    <div className="absolute content-stretch flex h-[21.594px] items-start justify-between left-[24px] top-[24px] w-[434.4px]" data-name="ExhibitionGallery">
      <CardTitle />
      <Badge />
    </div>
  );
}

function CardDescription() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[59.59px] w-[434.4px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] w-[404px]">Trưng bày các tác phẩm xuất sắc từ cuộc thi Hội họa Mùa xuân 2026</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="absolute h-[107.594px] left-[0.8px] top-[0.8px] w-[482.4px]" data-name="CardHeader">
      <ExhibitionGallery1 />
      <CardDescription />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[155.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">15/03/2026 - 30/03/2026</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon1 />
      <Text />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[214.15px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Phòng triển lãm A - Viện Mỹ Thuật</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon2 />
      <Text1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[28.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[8.2px] whitespace-nowrap">24 tác phẩm</p>
    </div>
  );
}

function ExhibitionGallery2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84.8px] items-start left-[24.8px] top-[132.39px] w-[434.4px]" data-name="ExhibitionGallery">
      <Container5 />
      <Container6 />
      <Container7 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-1 h-[241.994px] justify-self-stretch relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader />
      <ExhibitionGallery2 />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[180.156px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-1.8px] whitespace-nowrap">Triển lãm Cuối năm 2025</p>
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#eceef2] h-[21.594px] relative rounded-[8px] shrink-0 w-[80.044px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] whitespace-nowrap">Đã kết thúc</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery3() {
  return (
    <div className="absolute content-stretch flex h-[21.594px] items-start justify-between left-[24px] top-[24px] w-[434.4px]" data-name="ExhibitionGallery">
      <CardTitle1 />
      <Badge1 />
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[59.59px] w-[434.4px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Tổng hợp các tác phẩm tiêu biểu trong năm 2025</p>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="absolute h-[83.594px] left-[0.8px] top-[0.8px] w-[482.4px]" data-name="CardHeader">
      <ExhibitionGallery3 />
      <CardDescription1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[155.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">20/12/2025 - 10/01/2026</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon3 />
      <Text2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[213.15px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.6px] whitespace-nowrap">Phòng triển lãm B - Viện Mỹ Thuật</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Text3 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[28.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[8.2px] whitespace-nowrap">18 tác phẩm</p>
    </div>
  );
}

function ExhibitionGallery4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84.8px] items-start left-[24.8px] top-[108.39px] w-[434.4px]" data-name="ExhibitionGallery">
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-2 h-[241.994px] justify-self-stretch relative rounded-[14px] row-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader1 />
      <ExhibitionGallery4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[241.994px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[301.994px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading2 />
      <Container4 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[215.938px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-[-2px] whitespace-nowrap">Tất cả tác phẩm</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[78.731px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-1.8px] whitespace-nowrap">6 tác phẩm</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Heading3 />
          <Paragraph2 />
        </div>
      </div>
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.063px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Sắc hoa xuân</p>
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.063px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Nguyễn Minh Anh - HH2024A</p>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.06px] w-[313.063px]" data-name="CardHeader">
      <CardTitle2 />
      <CardDescription2 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108.319px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">5.000.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon5 />
        <Text4 />
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#f0fdf4] h-[21.594px] relative rounded-[8px] shrink-0 w-[53.963px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">Có sẵn</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery5() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] top-[443.06px] w-[265.063px]" data-name="ExhibitionGallery">
      <Container13 />
      <Badge2 />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute left-0 size-[313.063px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#f0b100] border-[0.8px] border-[rgba(0,0,0,0)] border-solid h-[21.594px] left-[232.47px] overflow-clip rounded-[8px] top-[14.8px] w-[68.594px]" data-name="Badge">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px] whitespace-nowrap">Giải Nhất</p>
    </div>
  );
}

function ExhibitionGallery6() {
  return (
    <div className="absolute left-0 overflow-clip size-[313.063px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback />
      <Badge3 />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-0 overflow-clip rounded-[14px] top-0 w-[314.663px]" data-name="Card">
      <CardHeader2 />
      <ExhibitionGallery5 />
      <ExhibitionGallery6 />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.069px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Tương lai số</p>
    </div>
  );
}

function CardDescription3() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Trần Hoàng Nam - TK2024B</p>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <CardTitle3 />
      <CardDescription3 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">4.500.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon6 />
        <Text5 />
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#f0fdf4] h-[21.594px] relative rounded-[8px] shrink-0 w-[53.963px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">Có sẵn</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery7() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] top-[443.07px] w-[265.069px]" data-name="ExhibitionGallery">
      <Container14 />
      <Badge4 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="absolute left-0 size-[313.069px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#f0b100] border-[0.8px] border-[rgba(0,0,0,0)] border-solid h-[21.594px] left-[239.94px] overflow-clip rounded-[8px] top-[14.8px] w-[61.125px]" data-name="Badge">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px] whitespace-nowrap">Giải Nhì</p>
    </div>
  );
}

function ExhibitionGallery8() {
  return (
    <div className="absolute left-0 overflow-clip size-[313.069px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback1 />
      <Badge5 />
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-[338.66px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <CardHeader3 />
      <ExhibitionGallery7 />
      <ExhibitionGallery8 />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.069px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Phong cảnh quê hương</p>
    </div>
  );
}

function CardDescription4() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Phạm Thu Hà - HH2024A</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <CardTitle4 />
      <CardDescription4 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108.319px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">3.500.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon7 />
        <Text6 />
      </div>
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-[#f0fdf4] h-[21.594px] relative rounded-[8px] shrink-0 w-[53.963px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">Có sẵn</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery9() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] top-[443.07px] w-[265.069px]" data-name="ExhibitionGallery">
      <Container15 />
      <Badge6 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="absolute left-0 size-[313.069px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#f0b100] border-[0.8px] border-[rgba(0,0,0,0)] border-solid h-[21.594px] left-[245.76px] overflow-clip rounded-[8px] top-[14.8px] w-[55.313px]" data-name="Badge">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px] whitespace-nowrap">Giải Ba</p>
    </div>
  );
}

function ExhibitionGallery10() {
  return (
    <div className="absolute left-0 overflow-clip size-[313.069px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback2 />
      <Badge7 />
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-[677.33px] overflow-clip rounded-[14px] top-0 w-[314.669px]" data-name="Card">
      <CardHeader4 />
      <ExhibitionGallery9 />
      <ExhibitionGallery10 />
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.063px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Hơi thở của mùa đông</p>
    </div>
  );
}

function CardDescription5() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.063px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Lê Văn E - HH2023B</p>
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.06px] w-[313.063px]" data-name="CardHeader">
      <CardTitle5 />
      <CardDescription5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108.319px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">3.000.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon8 />
        <Text7 />
      </div>
    </div>
  );
}

function ExhibitionGallery11() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] pr-[136.744px] top-[443.06px] w-[265.063px]" data-name="ExhibitionGallery">
      <Container16 />
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="absolute left-0 size-[313.063px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback3} />
    </div>
  );
}

function Badge8() {
  return (
    <div className="bg-[#030213] h-[45.6px] relative rounded-[8px] shrink-0 w-[91.394px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[16.8px] py-[8.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">Đã bán</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.6)] content-stretch flex items-center justify-center left-0 pr-[0.006px] size-[313.063px] top-0" data-name="Container">
      <Badge8 />
    </div>
  );
}

function ExhibitionGallery12() {
  return (
    <div className="absolute left-0 overflow-clip size-[313.063px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback3 />
      <Container17 />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-0 overflow-clip rounded-[14px] top-[516.67px] w-[314.663px]" data-name="Card">
      <CardHeader5 />
      <ExhibitionGallery11 />
      <ExhibitionGallery12 />
    </div>
  );
}

function CardTitle6() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.069px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Thành phố về đêm</p>
    </div>
  );
}

function CardDescription6() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Hoàng Thu F - TK2023A</p>
    </div>
  );
}

function CardHeader6() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <CardTitle6 />
      <CardDescription6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">4.000.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon9 />
        <Text8 />
      </div>
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-[#f0fdf4] h-[21.594px] relative rounded-[8px] shrink-0 w-[53.963px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">Có sẵn</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExhibitionGallery13() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] top-[443.07px] w-[265.069px]" data-name="ExhibitionGallery">
      <Container18 />
      <Badge9 />
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="h-[313.069px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback4} />
    </div>
  );
}

function ExhibitionGallery14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip size-[313.069px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback4 />
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-[338.66px] overflow-clip rounded-[14px] top-[516.67px] w-[314.669px]" data-name="Card">
      <CardHeader6 />
      <ExhibitionGallery13 />
      <ExhibitionGallery14 />
    </div>
  );
}

function CardTitle7() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[265.069px]" data-name="CardTitle">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[-1px] whitespace-nowrap">Mùa thu lá vàng</p>
    </div>
  );
}

function CardDescription7() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[58px] w-[265.069px]" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-1.8px] whitespace-nowrap">Ngô Thị G - HH2023A</p>
    </div>
  );
}

function CardHeader7() {
  return (
    <div className="absolute h-[82px] left-0 top-[337.07px] w-[313.069px]" data-name="CardHeader">
      <CardTitle7 />
      <CardDescription7 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108.319px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#9810fa] text-[16px] top-[-1.8px] whitespace-nowrap">3.200.000 VNĐ</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[24px] relative shrink-0 w-[128.319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Icon10 />
        <Text9 />
      </div>
    </div>
  );
}

function ExhibitionGallery15() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center justify-between left-[24px] pr-[136.75px] top-[443.07px] w-[265.069px]" data-name="ExhibitionGallery">
      <Container19 />
    </div>
  );
}

function ImageWithFallback5() {
  return (
    <div className="absolute left-0 size-[313.069px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback5} />
    </div>
  );
}

function Badge10() {
  return (
    <div className="bg-[#030213] h-[45.6px] relative rounded-[8px] shrink-0 w-[91.394px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[16.8px] py-[8.8px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">Đã bán</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.6)] content-stretch flex items-center justify-center left-0 size-[313.069px] top-0" data-name="Container">
      <Badge10 />
    </div>
  );
}

function ExhibitionGallery16() {
  return (
    <div className="absolute left-0 overflow-clip size-[313.069px] top-0" data-name="ExhibitionGallery">
      <ImageWithFallback5 />
      <Container20 />
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid h-[492.669px] left-[677.33px] overflow-clip rounded-[14px] top-[516.67px] w-[314.669px]" data-name="Card">
      <CardHeader7 />
      <ExhibitionGallery15 />
      <ExhibitionGallery16 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[1009.338px] relative shrink-0 w-full" data-name="Container">
      <Card2 />
      <Card3 />
      <Card4 />
      <Card5 />
      <Card6 />
      <Card7 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[1069.338px] items-start relative shrink-0 w-full" data-name="Section">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] h-[1515.331px] items-start left-[63px] pt-[48px] px-[16px] top-[288.79px] w-[1024px]" data-name="Container">
      <Section />
      <Section1 />
    </div>
  );
}

function ExhibitionGallery() {
  return (
    <div className="bg-[#f9fafb] h-[1804.125px] relative shrink-0 w-full" data-name="ExhibitionGallery">
      <Header />
      <Container1 />
      <Container3 />
    </div>
  );
}

function Section2() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

export default function UiDesign() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="UI Design">
      <ExhibitionGallery />
      <Section2 />
    </div>
  );
}