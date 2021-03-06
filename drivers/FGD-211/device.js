'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class FibaroDimmerDevice extends ZwaveDevice {

	onMeshInit() {
        this._momentaryTrigger = this.getDriver().momentaryTrigger;
        this._toggleTrigger = this.getDriver().toggleTrigger;
        this._rollerTrigger = this.getDriver().rollerTrigger;

		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		this.registerCapability('dim', 'SWITCH_MULTILEVEL');

		this.registerReportListener('SCENE_ACTIVATION', 'SCENE_ACTIVATION_SET', (report) => {
			if (report.hasOwnProperty('Scene ID')) {
				const data = {
					scene: report['Scene ID'].toString(),
				};

				switch (this.getSetting('switch_type')) {
					case '0': this._momentaryTrigger.trigger(this, null, data); break;
					case '1': this._toggleTrigger.trigger(this, null, data); break;
					case '2': this._rollerTrigger.trigger(this, null, data); break;
				}
			}
		});
	}

	switchTriggersRunListener(args, state) {
		return state && args && state.scene === args.scene;
	}
}

module.exports = FibaroDimmerDevice;
