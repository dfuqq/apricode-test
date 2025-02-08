import React from 'react';
import { cn } from '../utils/cn';

interface Props {
	className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
	children,
	className,
}) => {
	return (
		<div className={cn('mx-auto max-w-[1280px]', className)}>
			{children}
		</div>
	);
};
