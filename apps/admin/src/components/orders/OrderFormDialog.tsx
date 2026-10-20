import { Button } from '@koi/react/button';
import { Dialog } from '@koi/react/dialog';
import { Field } from '@koi/react/field';
import { Input } from '@koi/react/input';
import { Select } from '@koi/react/select';
import { css } from '@koi/react/styled-system/css';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { ORDER_STATUS, type Order, type OrderDraft, type OrderStatus } from '../../mock/api';

interface OrderFormValues {
  customer: string;
  product: string;
  amount: string;
  status: OrderStatus;
}

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The order being edited; null creates a new one. */
  order: Order | null;
  onSubmit: (values: OrderDraft) => Promise<void>;
}

/** Remounted by the route on every open, so react-hook-form always starts from the current order. */
export function OrderFormDialog({ open, onOpenChange, order, onSubmit }: OrderFormDialogProps) {
  const formId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    defaultValues: {
      customer: order?.customer ?? '',
      product: order?.product ?? '',
      amount: order ? order.amount.toFixed(2) : '',
      status: order?.status ?? 'pending',
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      customer: values.customer.trim(),
      product: values.product.trim(),
      amount: Number(values.amount),
      status: values.status,
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // The dialog keeps its spinner through the fade-out; a backdrop click during the request can't dismiss it.
        if (!next && isSubmitting) {
          return;
        }
        onOpenChange(next);
      }}
      title={order ? `编辑订单 ${order.id}` : '新增订单'}
      description={order ? `创建于 ${new Date(order.createdAt).toLocaleString('zh-CN')}` : '保存后会自动分配订单号。'}
      size="md"
      footer={
        <>
          <Button variant="ghost" color="secondary" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="submit" form={formId} loading={isSubmitting}>
            保存
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4' })}
      >
        <Field label="客户" required error={errors.customer?.message} className={css({ gridColumn: '1 / -1' })}>
          <Input {...register('customer', { required: '请输入客户名称' })} placeholder="例如：林晚照" />
        </Field>
        <Field label="商品" required error={errors.product?.message} className={css({ gridColumn: '1 / -1' })}>
          <Input {...register('product', { required: '请输入商品名称' })} placeholder="例如：锦鲤抱枕" />
        </Field>
        <Field label="金额" required error={errors.amount?.message}>
          <Input
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            {...register('amount', {
              required: '请输入金额',
              validate: (value) => {
                const amount = Number(value);
                return (Number.isFinite(amount) && amount > 0) || '金额必须大于 0';
              },
            })}
            placeholder="0.00"
          />
        </Field>
        <Field label="状态" required>
          <Select
            {...register('status')}
            options={Object.entries(ORDER_STATUS).map(([value, meta]) => ({ value, label: meta.label }))}
          />
        </Field>
      </form>
    </Dialog>
  );
}
