import { Subscription } from "rxjs";
import { Component } from "@angular/core";


@Component({
    selector: "app-subscriber-controller",
    template: "",
})
export class SubscriberController {
    subscription: { [key: string]: Subscription } = {};

    ngOnDestroy() {
        for (let key in this.subscription) {
            let value = this.subscription[key];
            value.unsubscribe();
        }
    }
}