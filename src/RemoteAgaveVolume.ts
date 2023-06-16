import { Euler, Object3D, Vector3 } from 'three';
import { ThreeJsPanel } from './ThreeJsPanel';

import { VolumeRenderImpl } from './VolumeRenderImpl';

export default class RemoteAgaveVolume implements VolumeRenderImpl {
    constructor() {
        console.log('RemoteAgaveVolume constructor');
    }

    get3dObject() :  Object3D { return new Object3D();}
    setRayStepSizes(_rayStepSize: number, _secondaryRayStepSize: number):void {0;}
    setScale(_scale: Vector3):void {0;}
    setOrthoScale(_scale: number):void {0;}
    setResolution(_x: number, _y: number):void {0;}
    setAxisClip(_axis: "x" | "y" | "z", _minval: number, _maxval: number, _isOrthoAxis: boolean):void {0;}
    setIsOrtho(_isOrtho: boolean):void {0;}
    setOrthoThickness(_thickness: number):void {0;}
    setInterpolationEnabled(_enabled: boolean):void {0;}
    setGamma(_gmin: number, _glevel: number, _gmax: number):void {0;}
    setFlipAxes(_flipX: number, _flipY: number, _flipZ: number):void {0;}
    doRender(_canvas: ThreeJsPanel): void {0;}
    cleanup(): void {0;}
    onChannelData(_batch: number[]): void {0;}
    setVisible(_visible: boolean): void {0;}
    setBrightness(_brightness: number): void {0;}
    setDensity(_density: number): void {0;}
    setChannelAsMask(_channel: number): boolean {return false;}
    setMaskAlpha(_alpha: number): void {0;}
    setShowBoundingBox(_show: boolean): void {0;}
    setBoundingBoxColor(_color: [number, number, number]): void {0;}
    viewpointMoved(): void {0;}
    updateClipRegion(_xmin: number, _xmax: number, _ymin: number, _ymax: number, _zmin: number, _zmax: number): void {0;}
    setPixelSamplingRate(_rate: number): void {0;}
    setRenderUpdateListener(_listener?: (iteration:number)=>void): void {0;}
    setTranslation(_translation: Vector3): void {0;}
    setRotation(_rotation: Euler): void {0;}


}
