import { GeometryProps, TextNodeProps } from '../types';
import { colorToRGB } from '../helpers/color';
import { convertFontStyle } from './converFontStyle';
import { transformDimensionMapper } from './transformDimension';

export type TextStyleProperties = {
    color?: string;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    fontSize?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    lineHeight?: number | string;
    letterSpacing?: number | string;
};

interface TextProperties extends GeometryProps, TextNodeProps {}

const textAlignMapping = {
    left: 'LEFT',
    right: 'RIGHT',
    center: 'CENTER',
    justify: 'JUSTIFIED'
};

export const transformTextStyleProperties = (style?: TextStyleProperties): TextProperties => {
    if (!style) {
        return {};
    }

    return {
        ...((style && style.color && { fills: [{ type: 'SOLID', color: colorToRGB(style.color) }] }) || {}),
        ...(style &&
            style.fontFamily && {
                fontName: { family: style.fontFamily, style: convertFontStyle(style.fontWeight, style.fontStyle) }
            }),
        ...(style && style.fontSize && { fontSize: style.fontSize }),
        ...(style &&
            style.textAlign &&
            textAlignMapping[style.textAlign] && { textAlignHorizontal: textAlignMapping[style.textAlign] }),
        ...(style &&
            (typeof style.lineHeight === 'number' || typeof style.lineHeight === 'string') && {
                lineHeight: transformDimensionMapper<LineHeight, LineHeight, LineHeight>(style.lineHeight)
                    .px(value => ({ value, unit: 'PIXELS' }))
                    .percentage(value => ({ value, unit: 'PERCENT' }))
                    .auto(() => ({ unit: 'AUTO' }))
                    .value()
            }),
        ...(style &&
            (typeof style.letterSpacing === 'number' || typeof style.letterSpacing === 'string') && {
                letterSpacing: transformDimensionMapper<LetterSpacing, LetterSpacing, LetterSpacing>(
                    style.letterSpacing
                )
                    .px(value => ({ value, unit: 'PIXELS' }))
                    .percentage(value => ({ value, unit: 'PERCENT' }))
                    .value()
            })
    };
};
