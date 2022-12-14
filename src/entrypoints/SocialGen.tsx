import s from './SocialGen.module.scss'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function SocialGen({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters;
  const { templateId, buttonLabel } = parameters

  const handleOpenModal = async () => {
    try {

      if (!templateId || !buttonLabel)
        throw new Error('Plugin not configured correctly!');

      const savedFields = ctx.item?.attributes[ctx.field.attributes.api_key] as string
      const fields = savedFields ? JSON.parse(savedFields) : undefined

      const result = await ctx.openModal({
        id: 'socialGenModal',
        title: 'Social image',
        width: 'xl',
        closeDisabled: false,
        parameters: { ...parameters, fields }
      });

      if (result)
        ctx.setFieldValue(ctx.field.attributes.api_key, JSON.stringify(result))

    } catch (err) {
      ctx.alert((err as Error).message)
    }
  }

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={handleOpenModal}>
        {buttonLabel || 'Generate image...'}
      </Button>
    </Canvas>
  );
}