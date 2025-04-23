import React from "react";

function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-black py-8 px-4 pb-[54px]">
      {/* ABOUT US CONTENT */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-black">Tongeren Getekend</h2>
        <p className="text-gray-700 mt-2 text-lg">
        Een eerbetoon aan recent architecturaal erfgoed  
        Ontdek de stad door de ogen van Hendrik-Marie, het alter ego van grafisch ontwerper Johan Vandebosch. Samen met Stijn Scholts vormt hij het collectief Grondslag, dat droomt van een Tongeren-Borgloon met hoogwaardige publieke ruimtes, hedendaagse architectuur en respect voor cultureel erfgoed.  
          <br />
          <br />
          In 'Tongeren Getekend' brengt Hendrik-Marie een visueel eerbetoon aan de 20ste-eeuwse Tongerse architectuur en haar meest karakteristieke gebouwen. Zijn tekeningen onthullen de harmonische composities en de tijdloze schoonheid van deze constructies. Een must-see voor liefhebbers van architectuur, erfgoed en grafische kunst!
        </p>
      </div>

      
    </div>
  );
}

export default AboutUsPage;
