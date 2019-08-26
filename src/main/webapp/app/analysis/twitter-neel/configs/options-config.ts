import { ChoicesOptionConfig, IOptionConfig, ChoiceEntry, NumberOptionConfig, BooleanOptionConfig } from 'app/analysis/models';

export const ANALYSIS_COMMON_OPTIONS: IOptionConfig[] = [
    new ChoicesOptionConfig('ner-recognizer', 'default', 'NER Recognizer', '', [new ChoiceEntry('default', 'Default')]),
    new ChoicesOptionConfig('nel-linker', 'default', 'NEL Linker', '', [new ChoiceEntry('default', 'Default')]),
    new ChoicesOptionConfig('geo-decoder', 'default', 'Geo Decoder', '', [new ChoiceEntry('default', 'Default')]),
];

export const STREAM_ANALYSIS_OPTIONS: IOptionConfig[] = [
    ...ANALYSIS_COMMON_OPTIONS,
    new NumberOptionConfig('stream-sampling', -1, 'Stream sampling', '', -1, 10, 1),
    new ChoicesOptionConfig('stream-lang', 'en', 'Stream lang', '', [new ChoiceEntry('en', 'English'), new ChoiceEntry('it', 'Italian')]),
    new BooleanOptionConfig('stream-skip-retweets', true, 'Skip retweets', ''),
];

export const DATASET_ANALYSIS_OPTIONS: IOptionConfig[] = [
    ...ANALYSIS_COMMON_OPTIONS,
];
