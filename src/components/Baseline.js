/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import merge from "merge";
import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

const defaultStyle = {
    valueLabel: {
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    cellLabel: {
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};

/**
 *
 * The BaseLine component displays a simple horizontal line at a value.
 *
 * For example the following code overlays Baselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <Baseline axis="price" value={series.avg()-series.stdev()} />
 *             <Baseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export default class Baseline extends React.Component {
    render() {
        if (!this.props.yScale || _.isUndefined(this.props.value)) {
            return null;
        }

        const y = this.props.yScale(this.props.value);
        const transform = `translate(0 ${y})`;
        let textAnchor;
        let textPositionX;
        const pts = [];

        const textPositionY = -3;

        if (this.props.position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (this.props.position === "right") {
            textAnchor = "end";
            textPositionX = this.props.width - 5;
        }

        pts.push("0 0");
        pts.push(`${this.props.width} 0`);
        const points = pts.join(" ");

        //
        // Style
        //

        const valueLabelStyle = merge(
            true,
            defaultStyle.valueLabel,
            this.props.style.valueLabel ? this.props.style.valueLabel : {}
        );
        const cellLabelStyle = merge(
            true,
            defaultStyle.cellLabel,
            this.props.style.cellLabel ? this.props.style.cellLabel : {}
        );
        const lineStyle = merge(
            true,
            defaultStyle.line,
            this.props.style.line ? this.props.style.line : {}
        );

        const valueLabelPositionX = this.props.cellLabel ? textPositionX - 30 : textPositionX;

        return (
            <g className="baseline" transform={transform}>
                <polyline points={points} style={lineStyle} />
                {this.props.valueLabel &&
                    <text
                        style={valueLabelStyle}
                        x={valueLabelPositionX}
                        y={textPositionY}
                        textAnchor={textAnchor}
                    >
                        {this.props.valueLabel}
                    </text>}
                {this.props.cellLabel &&
                    <text
                        style={cellLabelStyle}
                        x={textPositionX}
                        y={textPositionY}
                        textAnchor={textAnchor}
                    >
                        {this.props.cellLabel}
                    </text>}
            </g>
        );
    }
}

Baseline.defaultProps = {
    value: 0,
    valueLabel: "",
    cellLabel: "",
    position: "left",
    style: defaultStyle
};

Baseline.propTypes = {
    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: PropTypes.string.isRequired, // eslint-disable-line
    /**
     * An object describing the style of the baseline of the form
     * { label, line }. "label" and "line" are both objects containing
     * the inline CSS for that part of the baseline.
     */
    style: PropTypes.shape({
        valueLabel: PropTypes.object, // eslint-disable-line
        cellLabel: PropTypes.object, // eslint-disable-line
        line: PropTypes.object // eslint-disable-line
    }),
    /**
     * The y-value to display the line at.
     */
    value: PropTypes.number,
    /**
     * The value label to display with the axis.
     */
    valueLabel: PropTypes.string,
    /**
     * The cell label to display with the axis.
     */
    cellLabel: PropTypes.string,
    /**
     * Whether to display the label on the "left" or "right".
     */
    position: PropTypes.oneOf(["left", "right"]),
    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: PropTypes.func,
    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: PropTypes.number
};
