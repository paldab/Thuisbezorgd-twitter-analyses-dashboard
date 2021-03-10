import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { LoginOverlayComponent } from '../login-overlay/login-overlay.component';

interface DialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  width?: number | string;
  height?: number | string;
  
}

const DEFAULT_CONFIG: DialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'login-dialog-panel',
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayRef!: OverlayRef;
  // Inject overlay service
  constructor(private overlay: Overlay) { }

  open(config: DialogConfig = {}) {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    // Returns an OverlayRef (which is a PortalHost)
    this.overlayRef = this.createOverlay(dialogConfig);

    // Create ComponentPortal that can be attached to a PortalHost
    const loginPortal = new ComponentPortal(LoginOverlayComponent);

    // Attach ComponentPortal to PortalHost
    this.overlayRef.attach(loginPortal);
  }

  private createOverlay(config: DialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: DialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: config.width,
      height: config.height,
      positionStrategy
    });

    return overlayConfig;
  }
  public getRef(){
    return this.overlayRef;
  }
}
