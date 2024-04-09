import React from "react";
import { View3d, Volume, VolumeLoader } from "../es";
import { setupGui, showChannelUI } from "./gui-setup";
export const AICS_CELL_URL =
    "https://s3-us-west-2.amazonaws.com/bisque.allencell.org/v1.4.0/Cell-Viewer_Thumbnails/AICS-11";
export const AICS_CELL_ID = "AICS-11_3136";

export class VolumeViewer extends React.Component {
    constructor(props) {
        super(props);
        this.volumeViewer = React.createRef();
    }

    componentDidMount() {
        const ref = this.volumeViewer;
        if (!ref.current) {
            return;
        }
        const el = ref.current;
        this.view3D = new View3d(el);
        return fetch(`${AICS_CELL_URL}/${AICS_CELL_ID}_atlas.json`)
            .then((response) => {
                return response.json();
            })
            .then((jsondata) => {
                const aimg = new Volume(jsondata);
                this.view3D.addVolume(aimg);

                jsondata.images = jsondata.images.map((img) => ({
                    ...img,
                    name: `${AICS_CELL_URL}/${img.name}`,
                }));
                VolumeLoader.loadVolumeAtlasData(aimg, jsondata.images, (url, channelIndex) => {
                    const hmin = aimg.getHistogram(channelIndex).findBinOfPercentile(0.5);
                    const hmax = aimg.getHistogram(channelIndex).findBinOfPercentile(0.983);
                    const lut = new Lut().createFromMinMax(hmin, hmax);
                    aimg.setLut(channelIndex, lut);
          
                    this.view3D.setVolumeChannelEnabled(aimg, channelIndex, channelIndex < 3);
                    this.view3D.updateActiveChannels(aimg);

                    this.view3D.updateLuts(aimg);
                });
                // set some viewing parameters
                this.view3D.setCameraMode("3D");
                this.view3D.updateDensity(aimg, 0.05);
                this.view3D.updateExposure(0.75);
                return aimg;
            })
            .then((aimg) => {
                this.gui = setupGui(this.view3D);
                showChannelUI(aimg, this.view3D, this.gui);
            }
            
            )
            .catch(console.error);
    }
    render() {
        return <div style={{height: '80vh', width: '50%' }} ref={this.volumeViewer} />;
    }
}
