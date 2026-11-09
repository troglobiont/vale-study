# Expedition pilot · 0.14.0

Flow: subject → expedition desk → Ana’s letter → learning map → shared workbook answer p16-6 → explanation → optional p15-3 note → postcard studio → personal atlas → separate garden shelf.

Map data: Natural Earth countries 1:50m and rivers 1:10m (public domain). Original simplified display includes the Danube and its delta branches, Sava and Great Morava. No fictional loss location or boat trajectory to a Bulgarian beach is shown. Geography: https://www.icpdr.org/danube-basin/danube-river-basin/danube-river-basin-overview-map . License: https://www.naturalearthdata.com/about/terms-of-use/ .

The hero is original image_gen artwork. It contains no learning map or baked-in text. UI text and maps use RU/SR/EN. Speech is optional and depends on available device voices; no external narration service is required.

State: a separate top-level expedition object under the existing study save. Original nature records remain canonical for p16-6 and p15-3. The expedition stores help and first-attempt provenance, preferences, postcard design, one reward, and three separate shelf locations. Unknown help for an old workbook result stays unknown. Revealing the explanation never manufactures a correct workbook answer. Existing maths/English sessions and garden unlocks remain compatible.

Unsaved changes are retained transiently and can be retried; unrelated workbook edits are merged. The existing export includes the expedition. Old application versions preserve this unknown top-level field when saving, so the mathematical garden normalizer cannot discard expedition finds.

Learning, visual style, interaction and implementation were completed in sequence using separate scenario/design/development roles. Automated semantic and integration tests cover both helped and independent paths, legacy saves, language switches, progress guards, award idempotence, shelf movement and storage failure recovery. Browser QA covers the complete helped flow plus phone/tablet layouts. Child feedback and physical-device QA remain separate from technical release verification.
