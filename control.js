let app;
function main() {

    Vue.component('ctrl-slider', {
        data: function () {
            return {
                value: 0,
                min: 0,
                max: 100,
                step: 1,
                _tracking: false,
                _mouseDownLocal: undefined,
                _mouseDownGlobal: undefined
            }
        },
        computed: {
            _position: function() {
                // Real pixel location of marker
                if (this.value < this.min) {
                    return 0 - this._widthMarker/2;

                } else if (this.value > this.max) {
                    return this.max - this._widthMarker/2;

                }

                let range = this.max - this.min;
                let progress = this.value - this.min;
                let percent = progress / range;
                let width = this._widthSlider;
                let pixelPos = percent * width;
                let stepRounded = pixelPos;

                return stepRounded - this._widthMarker/2;
            }
        },
        mounted: function() {
            // Width of slider
            this._widthSlider = this.$el.getBoundingClientRect().width;

            // Width of marker
            let marker = this.$el.children[0];
            this._widthMarker = marker.getBoundingClientRect().width;

            // Type
            this._type = "SLIDER";
        },
        methods: {
            click: function(e) {
                // Block click if on marker
                if (e.target.className.includes("ctrl-marker")) {
                    e.stopPropagation();
                } else {
                    // Click event on ctrl-slider
                    // Set 'value' given local mouse click location
                    this._setValueGivenLocalOffset(
                        this._getLocalMousePosition(e)
                    );
                }
            },
            mousedown: function(e) {
                // On ctrl-marker
                this._mouseDownLocal = e.target.getBoundingClientRect().left;
                this._mouseDownGlobal = e.clientX;
                this._tracking = true;
            },
            _getLocalMousePosition: function(e) {
                // Mouse x-position relative to control
                return e.clientX - e.target.getBoundingClientRect().left;
            },
            _setValueGivenLocalOffset: function(xPosLocal) {
                //let range = this.max - this.min;
                let width = this._widthSlider;
                let pixelPos = xPosLocal;
                let percent = pixelPos / width;
                let range = this.max - this.min;
                let progress = percent * range;
                this.value = this.min + progress;
            }
        },
        template: `
        <div class="ctrl-slider"
            v-on:click="click"
        >
            <div class="ctrl-marker"
                v-on:mousedown="mousedown"
                v-bind:style="{left: _position + 'px'}"
            ></div>
        </div>`
    });

    app = new Vue({
        el: '#page'
    });

    let clearSliderControls = () => {
        // All sliders stop watching for mousemove
        for (let child of app.$children) {
            if (child._type === "SLIDER") {
                child._tracking = false;
                child._mouseDownLocal = undefined;
                child._mouseDownGlobal = undefined;
            }
        }
    };
    window.addEventListener("mouseup", e => {
        clearSliderControls();
    });
    window.addEventListener("mousemove", e => {
        for (let child of app.$children) {
            if (child._type === "SLIDER") {
                if (child._tracking) {
                    let offset = e.clientX - child._mouseDownGlobal;
                    let xPosLocal = child._mouseDownLocal + offset;
                    child._setValueGivenLocalOffset(xPosLocal);
                }
            }
        }
    });
}
window.onload = main;
