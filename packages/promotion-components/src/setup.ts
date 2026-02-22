import { registerComponent } from "./registry";
import { heroImageDefinition } from "./hero-image";
import { imageDefinition } from "./image";
import { textDefinition } from "./text";
import { buttonDefinition } from "./button";
import { spacerDefinition } from "./spacer";
import { dividerDefinition } from "./divider";
import { carouselDefinition } from "./carousel";
import { menuDefinition } from "./menu";
import { footerDefinition } from "./footer";
import { countdownDefinition } from "./countdown";
import { floatingCtaDefinition } from "./floating-cta";

let initialized = false;

export function setupComponents() {
  if (initialized) return;

  registerComponent(heroImageDefinition);
  registerComponent(imageDefinition);
  registerComponent(textDefinition);
  registerComponent(buttonDefinition);
  registerComponent(spacerDefinition);
  registerComponent(dividerDefinition);
  registerComponent(carouselDefinition);
  registerComponent(menuDefinition);
  registerComponent(footerDefinition);
  registerComponent(countdownDefinition);
  registerComponent(floatingCtaDefinition);

  initialized = true;
}
