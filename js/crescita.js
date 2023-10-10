$(function () {
   class Growth {
      yearGrowth(mass) {
         /**
          * Real growth rate with stocastic component
          * @type {Number}
          */
         let growthRate = this.meanGrowthRate * (1 + 0.1 * ((Math.random() * 2) - 1));
         /**
          * Potential biomass with stocastic component
          * @type {Number}
          */
         let potentialBiomass = this.meanPotentialBiomass * (1 + 0.1 * ((Math.random() * 2) - 1));
         /**
          * Calcolate the new mass
          * @type {Number}
          */
         let mass1 = growthRate * mass * (1 - (mass / potentialBiomass)) + mass;
         /**
          * If the mass is low there could be some new plats
          */
         if (mass1 < 1) {
            mass1 += Math.random() * 5;
         }
         return mass1;
      }
      constructor() {
         /**
          * Growth rate with
          * @type {Number}
          */
         this.meanGrowthRate = 0.02;
         /**
          * Potential biomass
          * @type {Number}
          */
         this.meanPotentialBiomass = 400;
         /**
          * Parcels
          * @type {Array}
          */
         this.ids = [];
      }
      printYear() {
         let i = $("#year").data("year");
         for (let p = 1; p < this.ids.length; p++) {
            let el = $("#" + this.ids[p]);
            let year = parseInt(el.data("year"));
            let mass = parseFloat(el.data("mass"));
            let mass1 = this.yearGrowth(mass);
            year = year + 1;
            this.printEl(el,year,mass1);
         }
         this.printSummary();
      }
      printSummary() {
         let year = $("#year");
         let i = year.data("year");
         let totalMass = 0;
         let totalYear = 0;
         for (let p = 0; p < this.ids.length; p++) {
            let el = $("#" + this.ids[p]);
            let mass = parseFloat(el.data("mass"));
            let y = parseFloat(el.data("year"));
            totalMass += mass; 
            totalYear += y;
         }
         year.html("Anno " + i + " - Media massa " + parseInt(totalMass/this.ids.length) + " m³/ha - Età media " + parseInt(totalYear/this.ids.length+1) + " - Massa raccolta "+parseInt(year.data("yeld"))+" m³").data("year",i);
      };
      printEl(el,year,mass1) {
         el.data("year", year);
         el.data("mass", mass1);
         el.attr("title", "Anno " + year + " Massa " + parseInt(mass1) + " m³");
         let col = parseInt(255 - mass1 / this.meanPotentialBiomass * 255);
         el.css("background-color", "rgb(200, 255, " + col + ")");
      }
      sleep(ms) {
         return new Promise(resolve => setTimeout(resolve, ms));
      }
      async start() {
         let minCol = 50;
         let maxCol = 100;
         let text = "";
         let self = this;
         for (let x = 0; x < 20; x++) {
            text += "<div style='width:40px;'>";
            for (let y = 0; y < 20; y++) {
               let id = "part-" + x + "-" + y;
               text += "<div id='" + id + "' data-year='0' data-mass='0' class='box cell'></div>";
               this.ids.push(id);
            }
            text += "</div>"
         }
         $("#start").append(text);
         $(".cell").on("click",function () {
            self.cutWood($(this));
         });
         $("#waiting").show();
         $("#waiting a").on("click",function () {
            self.nextStep();
         });
         $("#restart a").on("click",function () {
            window.location.reload();
         });
      }
      async nextStep() {
         $("#waiting").hide();
         $("#waiting a").text("Prosegui");
         let year = $("#year");
         for (let i = 0; i < 100; i++) {
            await this.sleep(10);
            let y = year.data("year");
            year.data("year",y+1);
            this.printYear();
         }
         $("#waiting").show();
         $("#restart").show();
      }
      cutWood(el) {
         let yeld = parseInt($("#year").data("yeld"));
         yeld += $(el).data("mass");
         $("#year").data("yeld",yeld); 
         let mass1 = 0;
         let year = 0;
         this.printEl(el,year,mass1);
         this.printSummary();
      }
   }
   let g = new Growth();
   g.start();
});
