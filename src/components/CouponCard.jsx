

const CouponCard = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className=" max-w-2xl  w-[350px]  h-[240px]  overflow-hidden shadow-2xl bg-[#0f351f] p-0 rounded-xl ">
        {/* Decorative corner elements */}
        
        
        {/* Dotted border pattern */}
        <div className="  inset-2 border-2 border- rounded-lg m-2 p-1 h-[93%]">

        
        <div className="pt-2 text-center space-y-2">
          {/* Header with bilingual text */}
          <div className="m-0">
            <div className="flex items-center justify-center gap-4 my-1 p-0">
              <span className="text-md font-bold text-[#E3DA69] uppercase tracking-wider">
                COUPON
              </span>
              <span className="text-md font-bold text-[#E3DA69] font-arabic">
                كوبون
              </span>
            </div>
          </div>
          
          {/* Product Image */}
          <div className="flex justify-evenly items-center m-0 w-[90%] mx-auto mb-4 mt-2 ">

              <img 
                src="./brut.png" 
                alt="brut image" 
                className="w-15 mt-2 m-0 scale-[1.95]"
              />
              <h1 className="mt-4 text-[18px] text-white font-bold font-sans ">LEGEND</h1>
              
            
          </div>
          
          {/* Main offer text in Arabic */}
          <div className="space-y-4 my-2 m-0">
            <div 
              className=" text-[13px] font-bold  mb-1 m-0 text-white leading-relaxed font-arabic"
              dir="rtl"
            >
              اشتري 12 قطعة من كريم حلاقة ليجند واحصل على صدرية للحلاقة مجانا
            </div>
            <div 
              className="text-[13px] text-[#E3DA69] m-0 font-arabic"
              dir="rtl"
            >
              متواجدة في جميع مراكز بيع عدد الحلاقة
            </div>
          </div>
          
          {/* Barber shop icon/decoration */}
          
          
          {/* Bottom instruction */}
          <div className=" mt-3 border-t-2 border-coupon-border/30 flex flex-col w-[95%] m-auto">
            <p 
              className=" text-[11px] mt-[7px] font-semibold ml-auto text-white font-arabic"
              dir="rtl"
            >
              يرجى احضار البطاقة
            </p>
          </div>
          
          {/* Serial number/validity */}
        </div>
              </div>
      </div>
    </div>
  );
};

export default CouponCard;