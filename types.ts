export interface HSLColor {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

export enum CloakStatus {
    IDLE = 'IDLE',
    CAPTURING_BACKGROUND = 'CAPTURING_BACKGROUND',
    ACTIVE = 'ACTIVE'
}

export interface ProcessingConfig {
    targetHue: number;
    hueThreshold: number;
    satThreshold: number;
    valThreshold: number;
}