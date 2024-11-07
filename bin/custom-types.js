export var ColorSchemeEnum;
(function (ColorSchemeEnum) {
    ColorSchemeEnum["fixed"] = "fixed";
    ColorSchemeEnum["dynamic"] = "dynamic";
    ColorSchemeEnum["ncbiblast"] = "ncbiblast";
    ColorSchemeEnum["blasterjs"] = "blasterjs";
})(ColorSchemeEnum || (ColorSchemeEnum = {}));
export const jobIdDefaults = {
    value: '',
    required: true,
    minLength: 35,
    maxLength: 60,
    pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/,
};
export const objectDefaults = {
    selectable: false,
    evented: false,
    objectCaching: false,
};
export const textDefaults = { ...objectDefaults };
export const rectDefaults = { ...objectDefaults };
export const lineDefaults = { ...objectDefaults };
export function toPositiveNumber(value) {
    if (value < 0) {
        throw new Error(`${value} is not a positive number`);
    }
    return value;
}
