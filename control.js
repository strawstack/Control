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
                let range = this.max - this.min;
                let progress = this.value - this.min;
                let percent = progress / range;
                let width = this._widthSlider;
                let pixelPos = percent * width;
                let value = pixelPos;
                // TODO Round value to step
                return this._clamp(value, 0, this._widthSlider);
            }
        },
        mounted: function() {

            let slider = this.$el;

            // Width of slider
            this._widthSlider = slider.getBoundingClientRect().width;

            // Width of marker
            let marker = slider.children[0];
            this._widthMarker = marker.getBoundingClientRect().width;

            // Type
            this._type = "SLIDER";
        },
        methods: {
            mousedown: function(e) {
                if (e.target.className.includes("ctrl-slider")) {
                    // Click event on ctrl-slider
                    // Set 'value' given local mouse click location
                    this._setValueGivenLocalOffset(
                        this._getLocalMousePosition(e)
                    );
                }

                if (e.target.className.includes("ctrl-marker")) {
                    let fromParent = this._getLocalMousePositionFromParent;
                    let p = e.target.parentNode;
                    this._mouseDownLocal = fromParent(e, this._bBox(p));
                    this._mouseDownGlobal = e.clientX;
                    this._tracking = true;
                    e.stopPropagation();
                } else {
                    let mousePos = this._getLocalMousePosition;
                    this._mouseDownLocal = mousePos(e);
                    this._mouseDownGlobal = e.clientX;
                    this._tracking = true;
                    e.stopPropagation();
                }
            },
            _getLocalMousePosition: function(e) {
                // Mouse x-position relative to control
                return e.clientX - e.target.getBoundingClientRect().left;
            },
            _getLocalMousePositionFromParent: function(e, parentBBox) {
                // Mouse x-position relative to control
                return e.clientX - parentBBox.left;
            },
            _setValueGivenLocalOffset: function(xPosLocal) {
                //let range = this.max - this.min;
                let width = this._widthSlider;
                let pixelPos = xPosLocal;
                let percent = pixelPos / width;
                let range = this.max - this.min;
                let progress = percent * range;
                let value = this.min + progress;
                this.value = this._clamp(value, this.min, this.max);
            },
            _bBox(elem) {
                return elem.getBoundingClientRect();
            },
            _clamp(value, min, max) {
                if (value < min) {
                    return min;
                } else if (value > max) {
                    return max;
                } else {
                    return value;
                }
            }
        },
        template: `
        <div class="ctrl-slider"
            v-on:mousedown="mousedown"
        >
            <div class="ctrl-highlight"
                v-bind:style="{width: _position + 'px'}"
            ></div>
            <div class="ctrl-marker"
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
