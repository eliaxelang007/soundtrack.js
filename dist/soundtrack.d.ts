type NewType<T, Brand extends string> = T & {
    __brand: Brand;
};
type Seconds = NewType<number, "Seconds">;
interface Track {
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    get duration(): Seconds;
}
interface AudioContextualized<OutputNode extends AudioNode> {
    get context(): AudioContext;
    get output_node(): OutputNode;
}
interface Compilable<OutputNode extends AudioNode, CompileTo extends AudioCommand<OutputNode, CompileTo>> {
    compile(context: AudioContext, output_node: OutputNode): Promise<CompileTo>;
}
interface AudioCommand<OutputNode extends AudioNode, Self extends AudioCommand<OutputNode, Self>> extends Track, AudioContextualized<OutputNode>, Compilable<OutputNode, Self> {
}
declare class Play<N extends AudioNode> implements Compilable<N, CompiledPlay<N>> {
    readonly path: string;
    constructor(path: string);
    compile(context: AudioContext, output_node: N): Promise<CompiledPlay<N>>;
}
declare class CompiledPlay<OutputNode extends AudioNode> implements AudioCommand<OutputNode, CompiledPlay<OutputNode>> {
    readonly context: AudioContext;
    readonly output_node: OutputNode;
    readonly players: Set<AudioBufferSourceNode>;
    readonly buffer: AudioBuffer;
    readonly duration: Seconds;
    constructor(context: AudioContext, output_node: OutputNode, buffer: AudioBuffer);
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledPlay<OutputNode>>;
}
declare class Clip<OutputNode extends AudioNode, CompileTo extends AudioCommand<OutputNode, CompileTo>, Child extends Compilable<OutputNode, CompileTo>> implements Compilable<OutputNode, CompiledClip<OutputNode, CompileTo>> {
    readonly to_clip: Child;
    readonly offset: Seconds;
    readonly duration: Seconds;
    constructor(to_clip: Child, offset: Seconds, duration: Seconds);
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledClip<OutputNode, CompileTo>>;
}
declare class CompiledClip<OutputNode extends AudioNode, Child extends AudioCommand<OutputNode, Child>> implements AudioCommand<OutputNode, CompiledClip<OutputNode, Child>> {
    readonly command: Child;
    readonly offset: Seconds;
    readonly duration: Seconds;
    constructor(command: Child, offset: Seconds, duration: Seconds);
    get context(): AudioContext;
    get output_node(): OutputNode;
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledClip<OutputNode, Child>>;
}
declare class Repeat<OutputNode extends AudioNode, CompileTo extends AudioCommand<OutputNode, CompileTo>, Child extends Compilable<OutputNode, CompileTo>> implements Compilable<OutputNode, CompiledRepeat<OutputNode, CompileTo>> {
    readonly to_repeat: Child;
    readonly duration: Seconds;
    constructor(to_repeat: Child, duration: Seconds);
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledRepeat<OutputNode, CompileTo>>;
}
declare class CompiledRepeat<OutputNode extends AudioNode, Child extends AudioCommand<OutputNode, Child>> implements AudioCommand<OutputNode, CompiledRepeat<OutputNode, Child>> {
    readonly command: Child;
    readonly duration: Seconds;
    constructor(command: Child, duration: Seconds);
    get context(): AudioContext;
    get output_node(): OutputNode;
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledRepeat<OutputNode, Child>>;
}
declare class Sequence<OutputNode extends AudioNode, CompileTo extends AudioCommand<OutputNode, CompileTo>, Child extends Compilable<OutputNode, CompileTo>> implements Compilable<OutputNode, CompiledSequence<OutputNode, CompileTo>> {
    readonly sequence: Child[];
    constructor(sequence: Child[]);
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledSequence<OutputNode, CompileTo>>;
}
declare class CompiledSequence<OutputNode extends AudioNode, Child extends AudioCommand<OutputNode, Child>> implements AudioCommand<OutputNode, CompiledSequence<OutputNode, Child>> {
    readonly commands: AudioCommand<OutputNode, Child>[];
    readonly duration: Seconds;
    readonly context: AudioContext;
    readonly output_node: OutputNode;
    constructor(context: AudioContext, output_node: OutputNode, commands: AudioCommand<OutputNode, Child>[]);
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledSequence<OutputNode, Child>>;
}
type AudioParamTransition = undefined | "exponential" | "linear";
type GainCommand = {
    transition?: AudioParamTransition;
    value: number;
    when: Seconds;
};
declare class Gain<OutputNode extends AudioNode, CompileTo extends AudioCommand<GainNode, CompileTo>, Child extends Compilable<GainNode, CompileTo>> implements Compilable<OutputNode, CompiledGain<OutputNode, CompileTo>> {
    readonly command: Child;
    readonly gain_commands: GainCommand[];
    constructor(command: Child, gain_commands: GainCommand[]);
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledGain<OutputNode, CompileTo>>;
}
declare class CompiledGain<OutputNode extends AudioNode, Child extends AudioCommand<GainNode, Child>> implements AudioCommand<OutputNode, CompiledGain<OutputNode, Child>> {
    readonly gain_node: GainNode;
    readonly to_gain: Child;
    readonly gain_commands: GainCommand[];
    readonly output_node: OutputNode;
    get duration(): Seconds;
    get context(): AudioContext;
    constructor(gain_node: GainNode, output_node: OutputNode, to_gain: Child, gain_commands: GainCommand[]);
    schedule(time_coordinate: Seconds, maybe_offset?: Seconds): void;
    cancel(time_coordinate: Seconds): void;
    compile(context: AudioContext, output_node: OutputNode): Promise<CompiledGain<OutputNode, Child>>;
}
export { type Seconds, Play, CompiledPlay, Clip, CompiledClip, Repeat, CompiledRepeat, Sequence, CompiledSequence, Gain, CompiledGain };
//# sourceMappingURL=soundtrack.d.ts.map