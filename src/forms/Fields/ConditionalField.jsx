import React from 'react';
import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';

export default function CustomFieldTemplate(props) {
  const {
    schema,
    uiSchema,
    errorSchema,
    idSchema,
    idPrefix,
    formContext,
    formData,
    onChange,
    onBlur,
    onFocus,
    registry,
    safeRenderCompletion,
    disabled,
    readonly,
    autofocus,
    rawErrors
  } = props;

  const _onChange = name => {
    return fieldData =>
      onChange({
        ...formData,
        [name]: fieldData
      });
  };

  return (
    <fieldset>
      {Object.keys(schema.properties).map(name => {
        // TODO Finish implementation for ui:visibleIf prop condition
        let isVisible = true;
        const hasVisibleIf = uiSchema[name]['ui:visibleIf'];
        return (
          isVisible && (
            <SchemaField
              schema={schema.properties[name]}
              uiSchema={uiSchema[name]}
              idSchema={idSchema[name]}
              formData={formData[name]}
              onChange={_onChange(name)}
              errorSchema={errorSchema[name]}
              registry={registry}
              formContext={formContext}
            />
          )
        );
      })}
    </fieldset>
  );
}
