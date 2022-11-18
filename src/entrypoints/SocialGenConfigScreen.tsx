import s from './SocialGenConfigScreen.module.scss'
import cn from 'classnames'
import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Form, TextField, SelectField, SelectInput } from 'datocms-react-ui';
import { useCallback, useEffect, useState } from 'react';
import { baseUrl } from '../utils';

export type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function SocialGenConfigScreen({ ctx }: PropTypes) {

  const [templates, setTemplates] = useState<any[]>([])
  const [formValues, setFormValues] = useState<Partial<ConfigParameters>>(ctx.parameters);

  const saveParameter = useCallback((field: string, value: string | boolean) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
  }, [formValues, setFormValues, ctx]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/template/list`)
        setTemplates(await res.json())
      } catch (err) {
        ctx.alert((err as Error).message)
      }
    })()
  }, [])
  const templateOptions = templates?.map(({ template: { id: value, name: label } }) => ({ label, value }))

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SelectField
          name="template"
          id="template"
          label="Template"
          value={templateOptions.find(t => t.value === formValues.template)}
          selectInputProps={{
            isMulti: false,
            options: templateOptions,
          }}
          onChange={(newValue) => {
            const template = newValue?.value as string;
            saveParameter('template', template)
          }}
        />
        <TextField
          id="width"
          name="width"
          label="Width"
          value={formValues.width}
          onChange={(value) => saveParameter('width', value)}
        />
        <TextField
          id="height"
          name="height"
          label="Height"
          value={formValues.height}
          onChange={(value) => saveParameter('height', value)}
        />
        <TextField
          id="button-label"
          name="button-label"
          label="Button label"
          value={formValues.buttonLabel}
          onChange={(value) => saveParameter('buttonLabel', value)}
        />
      </Form>
    </Canvas>
  );
}