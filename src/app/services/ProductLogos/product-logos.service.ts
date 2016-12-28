import { Injectable } from '@angular/core';

var dummy_data = [
  {
    alt: "DealerSocket",
    url: "",
    path: "../assets/dealersocket-logo.png"
  },
  {
    alt: "DealerFire",
    url: "",
    path: "../assets/dealerfire-logo.png"
  },
  {
    alt: "iDMS",
    url: "",
    path: "../assets/idms-logo.png"
  },
  {
    alt: "Inventory+",
    url: "",
    path: "../assets/inventory+-logo.png"
  },
  {
    alt: "Revenue Radar",
    url: "",
    path: "../assets/revenue-radar-logo.png"
  },
  {
    alt: "We Are Automotive",
    url: "",
    path: "../assets/we-are-automotive-logo.png"
  }
];

@Injectable()
export class ProductLogosService {
  logos = dummy_data;
  constructor() { }

  getLogos() {
    return this.logos;
  }

  getProductLogos() {
    return this.logos.filter(logo => logo.alt !== "We Are Automotive");
  }

  getLogo(logo: string) {
    for(var i = 0; i < this.logos.length; ++i) {
      if(this.logos[i].alt === logo) {
        // console.log(this.logos[i]);
        return this.logos[i];
      }
    }

    return null;
  }
}
