/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	PostTaxonomies,
	PostExcerptCheck,
	PageAttributesCheck,
	PostFeaturedImageCheck,
	PostTypeSupportCheck,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Section from './section';
import {
	EnablePluginDocumentSettingPanelOption,
	EnablePublishSidebarOption,
	EnablePanelOption,
	EnableFeature,
} from './options';
import MetaBoxesSection from './meta-boxes-section';

const MODAL_NAME = 'edit-post/options';

export function OptionsModal( { isModalActive, isViewable, closeModal } ) {
	if ( ! isModalActive ) {
		return null;
	}
	return (
		<Modal
			className="edit-post-options-modal"
			title={ __( 'Options' ) }
			closeLabel={ __( 'Close' ) }
			onRequestClose={ closeModal }
		>
			<Section title={ __( 'General' ) }>
				<EnablePublishSidebarOption
					help={ __(
						'Allow setting of tags, check dates for instance.'
					) }
					label={ __( 'Pre-publish checklist' ) }
				/>
				<EnableFeature
					featureName="mostUsedBlocks"
					label={ __( 'Most used blocks in library' ) }
				/>
				<EnableFeature
					featureName="showIconLabels"
					label={ __( 'Button text labels' ) }
				/>
			</Section>
			<Section title={ __( 'Keyboard' ) }>
				<EnableFeature
					featureName="keepCaretInsideBlock"
					help={ __(
						'When using the keyboard contains to active block.'
					) }
					label={ __( 'Contain the text cursor' ) }
				/>
			</Section>
			<Section title={ __( 'Appearance' ) }>
				<EnableFeature
					featureName="themeStyles"
					label={ __( 'Use theme styles' ) }
				/>
				<EnableFeature
					featureName="reducedUI"
					help={ __( 'Reduces toolbar and outlines.' ) }
					label={ __( 'Compact interface' ) }
				/>
				<EnableFeature
					featureName="focusMode"
					help={ __( 'Highlights the current block.' ) }
					label={ __( 'Spotlight mode' ) }
				/>
			</Section>
			<Section title={ __( 'Document panels' ) }>
				<EnablePluginDocumentSettingPanelOption.Slot />
				{ isViewable && (
					<EnablePanelOption
						label={ __( 'Permalink' ) }
						panelName="post-link"
					/>
				) }
				<PostTaxonomies
					taxonomyWrapper={ ( content, taxonomy ) => (
						<EnablePanelOption
							label={ get( taxonomy, [ 'labels', 'menu_name' ] ) }
							panelName={ `taxonomy-panel-${ taxonomy.slug }` }
						/>
					) }
				/>
				<PostFeaturedImageCheck>
					<EnablePanelOption
						label={ __( 'Featured image' ) }
						panelName="featured-image"
					/>
				</PostFeaturedImageCheck>
				<PostExcerptCheck>
					<EnablePanelOption
						label={ __( 'Excerpt' ) }
						panelName="post-excerpt"
					/>
				</PostExcerptCheck>
				<PostTypeSupportCheck
					supportKeys={ [ 'comments', 'trackbacks' ] }
				>
					<EnablePanelOption
						label={ __( 'Discussion' ) }
						panelName="discussion-panel"
					/>
				</PostTypeSupportCheck>
				<PageAttributesCheck>
					<EnablePanelOption
						label={ __( 'Page attributes' ) }
						panelName="page-attributes"
					/>
				</PageAttributesCheck>
			</Section>
			<MetaBoxesSection title={ __( 'Advanced panels' ) } />
		</Modal>
	);
}

export default compose(
	withSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		const { getPostType } = select( 'core' );
		const postType = getPostType( getEditedPostAttribute( 'type' ) );

		return {
			isModalActive: select( 'core/edit-post' ).isModalActive(
				MODAL_NAME
			),
			isViewable: get( postType, [ 'viewable' ], false ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			closeModal: () => dispatch( 'core/edit-post' ).closeModal(),
		};
	} )
)( OptionsModal );
