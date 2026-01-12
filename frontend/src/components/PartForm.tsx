import { Component, createSignal } from 'solid-js';
import type { Part } from '../types/models';
import { Button, Input } from './ui';

interface PartFormProps {
    initialData?: Partial<Part>;
    onSubmit: (data: Partial<Part>) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const PartForm: Component<PartFormProps> = (props) => {
    const [formData, setFormData] = createSignal<Partial<Part>>(
        props.initialData || {
            part_type: '',
            serial_number: '',
            manufacturer: '',
            fia_lifecycle_limit: undefined,
        }
    );

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        await props.onSubmit(formData());
    };

    const updateField = (field: keyof Part, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} class="space-y-4">
            <Input
                label="Part Type"
                value={formData().part_type || ''}
                onInput={(e) => updateField('part_type', e.currentTarget.value)}
                required
                fullWidth
            />

            <Input
                label="Serial Number"
                value={formData().serial_number || ''}
                onInput={(e) => updateField('serial_number', e.currentTarget.value)}
                required
                fullWidth
            />

            <Input
                label="Manufacturer"
                value={formData().manufacturer || ''}
                onInput={(e) => updateField('manufacturer', e.currentTarget.value)}
                fullWidth
            />

            <Input
                type="number"
                label="FIA Lifecycle Limit (km)"
                value={formData().fia_lifecycle_limit || ''}
                onInput={(e) => updateField('fia_lifecycle_limit', parseInt(e.currentTarget.value))}
                fullWidth
            />

            <div class="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={props.onCancel} type="button">
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={props.isLoading}
                >
                    {props.isLoading ? 'Saving...' : 'Save Part'}
                </Button>
            </div>
        </form>
    );
};

export default PartForm;
