import React from "react";

import EamesBird from "../assets/EamesBird.svg";
import LogoGrondslag from "../assets/logo-grondslag.svg";
import LogoMoment from "../assets/logo_moment.svg";

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


      <div id="about-us" className=" overflow-hidden w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg text-center overflow-y-auto max-h-[90vh]">
        
        <div className="text-white text-3xl  font-semibold text-left">
        Een eerbetoon aan recent architecturaal erfgoed  </div>
        <div className="text-white text-lg mt-3 text-left">

        In 'Tongeren Getekend' brengt Hendrik-Marie een visueel eerbetoon aan de 20ste-eeuwse Tongerse architectuur en haar meest karakteristieke gebouwen.

        <br /><br />
        Hendrik-Marie is het alter ego van grafisch ontwerper Johan Vandebosch. Samen met Stijn Scholts vormt hij het collectief Grondslag, dat droomt van een Tongeren-Borgloon met hoogwaardige publieke ruimtes, hedendaagse architectuur en respect voor cultureel erfgoed.  
          <br />
          <br />
           Zijn tekeningen onthullen de harmonische composities en de tijdloze schoonheid van deze constructies. Een must-see voor liefhebbers van architectuur, erfgoed en grafische kunst!
        </div>


    <div className="text-white text-left text-3xl  font-semibold mt-10">Over Grondslag</div>
        <div className="text-white text-xl text-left">
        Voor een mooier Tongeren-Borgloon
        </div>
        <div className="text-white text-lg mt-2 text-left">

        Grondslag is een collectief dat zich inzet voor een mooiere Tongeren-Borgloon. Een stad waar het fijn is om te leven, leren, werken en rond te hangen. We dromen van een Tongeren-Borgloon met veel kwalitatieve publieke ruimte en een stad waar op een fijne manier wordt omgegaan met ons erfgoed.
</div>

        <div className="text-white mt-3 text-xl  font-bold text-left">
Publieke Ruimte en het straatbeeld
</div>
<div className="text-white text-lg text-left">
De laatste 150 jaar is de aanblik van onze stad grondig veranderd. Jammer genoeg werd er erg slordig omgegaan met het uitzicht van onze stad. De verappartementisering die al sinds de jaren 60 van vorige eeuw aan de gang is zorgde ervoor dat heel wat prachtige gebouwen werden afgebroken en te veel open ruimte verdween.

</div>
        <div className="text-white mt-3 text-lg text-left">
Erfgoed gaat verder dan de middeleeuwen<br />
Tongeren-Borgloon is een  erfgoedstad. Maar dat omvat meer dan het Romeinse en middeleeuwse verleden.
Tongeren kent veel klein bouwkundig erfgoed zoals kapellen, kruisen, graftekens en straatmeubilair, maar ook grote bouwwerken zoals kerken, industriële panden, molens, hoeven, woonhuizen, kastelen en kloosters.
Met Grondslag tonen we het recente erfgoed.
</div>

<div className="text-white mt-3 text-2xl font-semibold text-left">
We Informeren
</div>
        <div className="text-white text-lg text-left">
We informeren de bewoners en bezoekers over de troeven en uitdagingen van onze steden.
</div>
<div className="text-white mt-3 text-2xl  font-semibold text-left">
We Sensibiliseren
</div>
<div className="text-white text-lg text-left">
We sensibiliseren de bewoners van Tongeren-Borgloon voor de cultureel-historische waarde van ons onroerend erfgoed. We moedigen iedereen aan om hier een actieve rol in te nemen en ondersteunen hen waar kan.
</div>
<div className="text-white mt-3 text-2xl  font-semibold text-left">
We Connecteren
</div>
<div className="text-white text-lg text-left">
We connecteren met organisaties en dwarse denkers die onze dromen delen.
</div>
<div className="text-white mt-3 text-2xl  font-semibold text-left">
We trekken en duwen
</div>
<div className="text-white text-lg text-left">
We moedigen lokale beleidsmakers aan om zich meer in te zetten voor een kwalitatieve open ruimte en een beter erfgoed beleid.






        </div>

        <img src={LogoGrondslag} alt="Eames Bird" className="my-3 w-36  border-white" style={{ filter: "invert(1)" }}  />


<div className="text-white text-left text-3xl font-semibold mt-10">Over MoMeNTfestival </div>
<div className="text-white text-lg mt-2 text-left">MoMeNT is sinds 2017 hét jaarlijks eigenzinnig en innovatief stadsfestival in Tongeren-Borgloon met TIJD als verbindende factor, geënt op het DNA van onze stad. Het festival is al acht jaar een vaste baken in het Vlaamse kunstenlandschap en daarbuiten, ingebed in het decor van de eerste Stad.
<br /><br />
MoMeNTfestival presenteert veertien dagen lang podiumkunsten in een eigenzinnige combinatie van theater, muziek, beeldende kunsten, film en andere disciplines.

</div>




        <img src={LogoMoment} alt="Eames Bird" className="my-3 w-44  border-white" style={{ filter: "invert(1)" }}  />




      </div>

      
    </div>
      
    </div>
  );
}

export default AboutUsPage;
