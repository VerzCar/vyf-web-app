import type { Meta } from '@storybook/angular';
import { StoryObj } from '@storybook/angular';
import { ButtonLinkComponent } from './button-link.component';

const meta: Meta<ButtonLinkComponent> = {
    component: ButtonLinkComponent,
    title: 'ButtonLinkComponent'
};
export default meta;
type Story = StoryObj<ButtonLinkComponent>;

export const Primary: Story = {
    args: {

    }
};
