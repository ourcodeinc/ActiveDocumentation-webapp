import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';
import chroma from 'chroma-js';

export default class FilterComponent extends Component {

    constructor(props) {
        super(props);

        let visitedFilesOptions = props.visitedFiles.map(d => {
            return {
                ...d,
                type: "visitedFiles",
                value: d.fileName,
                label: `File: ${d.fileName}`,
                color: "red",
            }
        });

        let searchHistoryOptions = props.searchHistory.map(d => {
                return {
                    ...d,
                    type: "searchHistory",
                    value: d,
                    label: `Search Term: ${d}`,
                    color: "blue"
                }
            }
        );
        let customFeaturesOptions = props.customFeatures.map(d => {
            return {
                ...d,
                type: "customFeatures",
                value: d.featureDescription,
                label: `Custom Features: ${d.featureDescription}`,
                color: "purple"
            }
        });

        let allOptions = visitedFilesOptions.concat(searchHistoryOptions)
            .concat(customFeaturesOptions);

        this.state = {
            options: allOptions
        };

    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        let visitedFilesOptions = nextProps.visitedFiles.map(d => {
            return {
                ...d,
                type: "visitedFiles",
                value: d.fileName,
                label: d.fileName,
                color: "red",
            }
        });

        let searchHistoryOptions = nextProps.searchHistory.map(d => {
                return {
                    ...d,
                    type: "searchHistory",
                    value: d,
                    label: d,
                    color: "blue"
                }
            }
        );
        let customFeaturesOptions = nextProps.customFeatures.map(d => {
            return {
                ...d,
                type: "customFeatures",
                value: d.featureDescription,
                label: `Custom Features: ${d.featureDescription}`,
                color: "purple"
            }
        });
        let allOptions = visitedFilesOptions.concat(searchHistoryOptions)
            .concat(customFeaturesOptions);

        this.setState( {
            options: allOptions
        });
    }

    optionStyles = {
        control: styles => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = data.color ? chroma(data.color) : chroma("brown");
            return {
                ...styles,
                backgroundColor: isDisabled
                    ? null
                    : isSelected
                        ? data.color
                        : isFocused
                            ? color.alpha(0.1).css()
                            : null,
                color: isDisabled
                    ? '#ccc'
                    : isSelected
                        ? chroma.contrast(color, 'white') > 2
                            ? 'white'
                            : 'black'
                        : data.color,
                cursor: isDisabled ? 'not-allowed' : 'default',

                ':active': {
                    ...styles[':active'],
                    backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                },
            };
        },
        multiValue: (styles, { data }) => {
            const color = chroma("grey"); //data.color
            return {
                ...styles,
                backgroundColor: color.alpha(0.1).css(),
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: data.color,
            ':hover': {
                backgroundColor: data.color,
                color: 'white',
            },
        }),
    };


    render() {
        return (
            <CreatableSelect
                isMulti
                defaultValue={this.state.options}
                onChange={this.handleChange}
                options={this.state.options}
                styles={this.optionStyles}
            />
        );
    }


    handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };
}