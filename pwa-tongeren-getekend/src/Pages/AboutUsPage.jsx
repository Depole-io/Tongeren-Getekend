import React from "react";

import EamesBird from "../assets/EamesBird.svg";
import Roofvogel from "../assets/roofvogel.svg";


function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 ">
      {/* ABOUT US CONTENT */}


    <div className="flex flex-row gap-6 w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="flex flex-col">
      <div className="text-white text-6xl font-bold [writing-mode:vertical-lr] flex flex-col">
       Tongeren
       </div>
       <img src={EamesBird} alt="Eames Bird" className="my-3 w-10 h-10  border-white" style={{ filter: "invert(1)" }}  />
       <div className="text-white text-6xl font-bold [writing-mode:vertical-lr] flex flex-col">
        Getekend
       </div>
      </div>


      <div id="about-us" className=" overflow-hidden w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg text-center overflow-y-auto max-h-[80vh]">
        
        <p className="text-white text-lg text-left">
        Een eerbetoon aan recent architecturaal erfgoed  
        Ontdek de stad door de ogen van Hendrik-Marie, het alter ego van grafisch ontwerper Johan Vandebosch. Samen met Stijn Scholts vormt hij het collectief Grondslag, dat droomt van een Tongeren-Borgloon met hoogwaardige publieke ruimtes, hedendaagse architectuur en respect voor cultureel erfgoed.  
          <br />
          <br />
          In 'Tongeren Getekend' brengt Hendrik-Marie een visueel eerbetoon aan de 20ste-eeuwse Tongerse architectuur en haar meest karakteristieke gebouwen. Zijn tekeningen onthullen de harmonische composities en de tijdloze schoonheid van deze constructies. Een must-see voor liefhebbers van architectuur, erfgoed en grafische kunst!
        </p>

        <p className="text-white text-lg text-left">
        Een eerbetoon aan recent architecturaal erfgoed  
        Ontdek de stad door de ogen van Hendrik-Marie, het alter ego van grafisch ontwerper Johan Vandebosch. Samen met Stijn Scholts vormt hij het collectief Grondslag, dat droomt van een Tongeren-Borgloon met hoogwaardige publieke ruimtes, hedendaagse architectuur en respect voor cultureel erfgoed.  
          <br />
          <br />
          In 'Tongeren Getekend' brengt Hendrik-Marie een visueel eerbetoon aan de 20ste-eeuwse Tongerse architectuur en haar meest karakteristieke gebouwen. Zijn tekeningen onthullen de harmonische composities en de tijdloze schoonheid van deze constructies. Een must-see voor liefhebbers van architectuur, erfgoed en grafische kunst!
        </p>


      </div>

      
    </div>
      
    </div>
  );
}

export default AboutUsPage;
