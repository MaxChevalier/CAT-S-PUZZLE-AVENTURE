import { Component, Input } from '@angular/core';
import { HeroAnimation } from '../../../../../enum/heroAnimation';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  currentAnimation: HeroAnimation;
  css: string;
  currentCoordinates: {x: number, y: number};
  flip: string;
  
  @Input({ required: true }) heroSpeed: number = 250;
  @Input({required: true}) cellSize: string = '10px';

  constructor() {
    this.currentAnimation = HeroAnimation.wait;
    this.css = ''
    this.currentCoordinates = {x: 0, y: 0};
    this.flip = '';
  }

  public moveTo(X: number, Y: number, speed: number = 1) {
    this.updateAnimation('walk');
    let top = `calc(${Y} * calc(${this.cellSize} + 1px) + 10px)`;
    let left = `calc(${X} * calc(${this.cellSize} + 1px) + 10px)`;
    this.css = `top: ${top}; left: ${left};transition : linear ${this.heroSpeed * speed}ms;`;
    if (this.currentCoordinates.x < X) {
      this.flip = 'transform: scaleX(1);';
    } else if (this.currentCoordinates.x > X) {
      this.flip = 'transform: scaleX(-1);';
    }
    this.currentCoordinates = {x: X, y: Y};
  }

  public updateAnimation(name: string) {
    switch (name) {
      case 'walk':
        this.currentAnimation = HeroAnimation.walk;
        break;
      case 'eat':
        this.currentAnimation = HeroAnimation.eat;
        break;
      default:
        this.currentAnimation = HeroAnimation.wait;
        break;
    }
  }
}
