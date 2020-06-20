# Control

Remaking standard web controls using the standard HTML elements and VueJS to improve flexibility.

# Technical Details

Controls are VueJS components.

# Range Slider (ctrl-slider)

The range slider binds events through VueJS in order to update the controls state when the control is interacted with. Oppositely, when the controls state is modified the control will visually update.

# Modifying State of a Control

`app.$children[0].value = 100;`

or

`app.$children[<control_index>].<state_name> = <value>;`

The index of the control depends on the order it was added to Vue

# Todo

- [ ] Bug: value to pixel conversion does not take into account the CSS width of a slider.

- [ ] Make a way to pass a control name from HTML through to state object. Example: If control is named `sam` then `this.sam.<state>` is bound to Vue state
