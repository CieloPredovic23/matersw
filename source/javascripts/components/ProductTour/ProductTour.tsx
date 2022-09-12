/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect } from "react";
import { useState } from "react";
import { Highlighter } from "./Highlighter";
import { ProductTooltip } from "./ProductTooltip";
import { ProductTourProps, Tips } from "./types";
import { useTrackingFunction } from "./useTrackingFunction";
import { tips } from "./tips";
import { useWaitForElements } from "./useWaitForElement";
import { useProductTour } from "./useProductTour";
import { useHighlightedArea, getClipPathFromRect } from "./useHighlightedArea";

export const ProductTourContent = ({ menuIds, currentUser }: ProductTourProps): JSX.Element | null => {
	const [isOpen, setIsOpen] = useState(true);
	const [validTips, setValidTips] = useState<Tips[] | null>(null);

	const onFound = () => {
		const filtered = tips.filter(tip => menuIds.includes(tip.id));
		setValidTips(filtered);
	};

	// NOTE: Angular passes the menu items ids it will render,
	// but we stil need to wait for the templates to render them before we can move on.
	useWaitForElements(menuIds, onFound);

	const { tip, finished, onNext, onPrev, selectedId, selectedIndex, items } = useProductTour(validTips ?? []);

	const rect = useHighlightedArea(selectedId);

	const onDisplayTooltip = useTrackingFunction(() => ({
		event: "tooltip_displayed",
		payload: {
			user_slug: currentUser.slug,
			user_id: currentUser.dataId,
			location: "workflow_editor",
			name: selectedId
		}
	}));

	const onTrackClose = useTrackingFunction(() => ({
		event: "tooltip_closed",
		payload: {
			user_slug: currentUser.slug,
			user_id: currentUser.dataId,
			location: "workflow_editor",
			name: selectedId
		}
	}));

	const onButtonClick = useTrackingFunction((buttonName: string) => ({
		event: "tooltip_clicked",
		payload: {
			user_slug: currentUser.slug,
			user_id: currentUser.dataId,
			location: "workflow_editor",
			name: selectedId,
			button: buttonName
		}
	}));

	const onClose = (): void => {
		setIsOpen(false);
		onTrackClose();
	};

	const clipPath = getClipPathFromRect(rect);
	const highlighted = !!clipPath;

	useEffect(() => {
		if (isOpen && !!selectedId && highlighted) {
			onDisplayTooltip();
		}
	}, [isOpen, onDisplayTooltip, selectedId, highlighted]);

	if (!tip || !rect) {
		return null;
	}

	return (
		<Highlighter isOpen={isOpen} rect={rect} clipPath={clipPath}>
			<ProductTooltip
				onClose={onClose}
				onButtonClick={onButtonClick}
				finished={finished}
				onNext={onNext}
				onPrev={onPrev}
				selectedIndex={selectedIndex!}
				total={items.length}
				rect={rect}
				tip={tip}
			/>
		</Highlighter>
	);
};

export const ProductTour = ({ menuIds, currentUser }: ProductTourProps): JSX.Element | null => {
	if (currentUser?.tourShown !== false) {
		return null;
	}

	return <ProductTourContent menuIds={menuIds} currentUser={currentUser} />;
};
