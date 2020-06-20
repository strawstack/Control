var app;
function main() {

    Vue.component('ctrl-slider', {
        data: function () {
            return {
                value: 0,
                min: 0,
                max: 100,
                step: 1
            }
        },
        computed: {
            _position: function() {
                // Real pixel location of marker
                let range = this.max - this.min;
                let value = this.value;
                let percent = value / range;
                let pixelPos = percent * range;
                let stepRounded = pixelPos;
                return stepRounded;
            }
        },
        methods: {
            click: function(e) {
                // Click event on ctrl-slider
                console.log("click");
                // TODO - Set this.value according to click location
            },
            mousedown: function(e) {
                // On ctrl-marker
                console.log("down");
            },
            mouseup: function(e) {
                // On ctrl-marker
                console.log("up");
            },
            mousemove: function(e) {
                // On ctrl-marker
                console.log("move");
            },
            _getLocalPosition: function(mousePos, domRect) {
                // Mouse x-position relative to control
                return this._getGlobalPosition() - domRect.left;
            },
            _getGlobalPosition: function(e) {
                // Mouse x-position relative to viewport
                return e.clientX;
            }
        },
        template: `
        <div class="ctrl-slider" v-on:click="click">
            <div class="ctrl-marker"
                v-on:mousedown="mousedown"
                v-on:mouseup="mouseup"
                v-on:mousemove="mousemove"
                v-bind:style="{left: _position + 'px'}"
            ></div>
        </div>`
    });

    app = new Vue({
        el: '#page'
    })
}
window.onload = main;
