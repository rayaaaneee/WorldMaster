"use client";

import ColorableFlag, { Shape, ShapeClickerCallback } from '@/components/colorable-flag';
import Country from '@/useful/interfaces/country';
import SyntaxHighlighter from 'react-syntax-highlighter';

import styles from "@/asset/scss/dev.module.scss";

import ButtonGoBackOrNext, { Direction } from "@/components/inputs/button-go-back-or-next";

import countriesArray from "@/asset/data/countries.json";
import { useParams } from 'next/navigation';
import uppercaseFirstWordsLetters from '@/useful/uppercaseFirstWordsLetters';
import { vs2015 as theme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Checkbox from '@/components/inputs/checkbox';
import CopyButton from '@/components/inputs/copy-button';
import SelectableColorCircle from '@/components/selectable-color-circle';
import Tooltip from '@/components/usefuls/tooltip';

import { CiEraser } from "react-icons/ci";
import Button from '@/components/inputs/button';
import { MouseEvent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PaintbrushMouse from '@/components/svg/paintbrush-mouse';
import Position from '@/useful/interfaces/position';
import { IoSendSharp } from "react-icons/io5";
import toast from 'react-hot-toast';

import Alert from '@/components/usefuls/alert';
import rgbToHex, { hexCanBecomeShorter, shortenHexColor } from '@/useful/rgbToHex';

export interface VerifyCountriesProps {

}

export interface SvgCodeInterface {
    svg: string;
    firstAssignment: boolean;
}

export type ButtonKey = 'selector' | 'eraser';
export interface ToolButtonInterface { 
    texture: string, 
    key: ButtonKey, 
    mouseBackground: string,
    pathBackground: string 
}

const VerifyCountries = ({}: VerifyCountriesProps) => {

    const [svgCode, setSvgCode] = useState<SvgCodeInterface | null>(null);

    const [cleared, setCleared] = useState<boolean>(false);
    const [allShapesKeeped, setAllShapesKeeped] = useState<boolean>(false);
    const [colorableShapes, setColorableShapes] = useState<Shape[]>([]);

    const deselectAllShapes = () => {
        colorableShapes.forEach((shape) => {
            shape.setAttribute('fill', `url(#emptyPathImg)`);
        });
    }

    const selectAllShapes = () => {
        colorableShapes.forEach((shape) => {
            shape.setAttribute('fill', `url(#selectedPathImg)`);
        });
    }
    
    const tools: ToolButtonInterface[] = [
        {
            texture: '/selector.png',
            key: 'selector',
            mouseBackground: 'selectedPathImg',
            pathBackground: 'selectedPathImg'
        },
        {
            texture: '/eraser.png',
            key: 'eraser',
            mouseBackground: 'emptyGreyPathImg',
            pathBackground: 'emptyPathImg'
        }
    ];
    const [toolSelected, setToolSelected] = useState<ToolButtonInterface | null>(null);

    const [initialPaintbrushPosition, setInitialPaintbrushPosition] = useState<Position | null>(null);

    const countries: Country[] = countriesArray as Country[];

    const { country_code } = useParams<{ country_code?: string }>() as any;

    const countryElement: Country | undefined = countries.find((element: Country) => (element.code === (country_code as string)));

    const countryName: string = countryElement !== undefined ? uppercaseFirstWordsLetters(countryElement.name) : 'Unknown';

    const svgCodeContainer = useRef<HTMLDivElement>(null);

    const hasSelectedShapes: boolean = useMemo(() => {
        return allShapesKeeped || svgCodeContainer.current?.querySelector(".keep") !== null;
    }, [svgCode, allShapesKeeped]);

    const [alreadyTreated, setAlreadyTreated] = useState<boolean>(false);
    
    useEffect(() => {
        if (svgCode !== null) {
            if (svgCode.firstAssignment) {
                const alreadyKeepedAll: boolean = svgCode.svg.includes('class="keep-all"');
                const alreadyKeepedOnes: boolean = svgCode.svg.includes('class="keep"');
                if (alreadyKeepedAll) {
                    setAllShapesKeeped(true);
                    selectAllShapes();
                } else if (alreadyKeepedOnes) {
                    // TODO: Select the shapes that are already keeped
                }
                setAlreadyTreated(alreadyKeepedAll || alreadyKeepedOnes);
            }
        }
    }, [svgCode]);

    const clearAll: MouseEventHandler<HTMLButtonElement> = (e) => {
        setCleared(true);
        setAllShapesKeeped(false);
        setToolSelected(null);
        setInitialPaintbrushPosition(null);
    }

    const updateSvgCode = () => {
        if (svgCodeContainer.current !== null) {
            const svgElement: SVGElement | null = svgCodeContainer.current?.querySelector('svg');
            if (svgElement !== null) {
                setSvgCode({svg: svgElement.outerHTML, firstAssignment: false});
                return;
            }
        }
        toast.error('Cannot update the svg code');
    }

    useEffect(() => {
        if (allShapesKeeped) {
            setToolSelected(null);
            setInitialPaintbrushPosition(null);
            if (svgCodeContainer.current !== null) {
                const svgElement: SVGElement | null = svgCodeContainer.current?.querySelector('svg');
                if (svgElement !== null) {
                    svgElement.classList.add('keep-all');
                    svgElement.querySelectorAll('.keep').forEach((element: Element) => {
                        element.removeAttribute('class');
                    });
                    updateSvgCode();
                    selectAllShapes();
                }
            }
        } else {
            if (svgCodeContainer.current !== null) {
                const svgElement: SVGElement | null = svgCodeContainer.current?.querySelector('svg');
                if (svgElement !== null) {
                    svgElement.removeAttribute('class');
                    updateSvgCode();
                    deselectAllShapes();
                }
            }
        }
    }, [allShapesKeeped]);

    const onSelect = (e: MouseEvent, button: ToolButtonInterface) => {
        if (toolSelected?.key === button.key) {
            setToolSelected(null);
            setInitialPaintbrushPosition(null);

        } else {
            const rect: DOMRect = e.currentTarget.getBoundingClientRect();
            const middleX = rect.x + (rect.width / 2);
            const middleY = rect.y + (rect.height / 2);
            setInitialPaintbrushPosition({ x: middleX, y: middleY });
        
            setToolSelected(button);
        }
    }

    const onClickOnShape: ShapeClickerCallback = useCallback((shape: Shape) => {
        if (toolSelected === null) {
            toast.error('Please select a tool first');
            return;
        }
        if (allShapesKeeped) {
            toast.error('You cannot select shapes when all shapes are kept');
            return;
        }

        if (shape.getAttribute("data-fill") !== null) {
            const pathBackground: string = toolSelected.pathBackground;
            shape.setAttribute('fill', `url(#${pathBackground})`);
    
            const shapeCopy: HTMLElement = shape.cloneNode(true) as HTMLElement;
            shapeCopy.removeAttribute('class');

            const dataFill: string = rgbToHex(shape.getAttribute('data-fill') as string);
            const canBeShortened: boolean = hexCanBecomeShorter(dataFill);
            const shortenDataFill: string | null = canBeShortened ? shortenHexColor(dataFill) : null;

            shapeCopy.setAttribute('fill', canBeShortened ? shortenDataFill as string : dataFill);
            shapeCopy.removeAttribute('data-fill');
            shapeCopy.removeAttribute('style');

            if (toolSelected.key === 'selector') {

                shapeCopy.classList.add('keep');
            }

            if (svgCodeContainer.current !== null) {
                const fill: string | null = shapeCopy.getAttribute('fill');
                const d: string | null = shapeCopy.getAttribute('d');
                const tagName: string = shapeCopy.tagName.toLowerCase();

                const selector: string = `${tagName}[d="${d}"][fill="${fill}"]`;

                if (svgCodeContainer.current.querySelector(selector) !== null) {

                    svgCodeContainer.current.querySelector(selector)!.replaceWith(shapeCopy);

                    updateSvgCode();

                } else {
                    if (toolSelected.key === 'selector') {
                        toast.error('Cannot find the shape to select');
                    } else if (toolSelected.key === 'eraser') {
                        toast.error('Cannot find the shape to erase');
                    }
                }

            } else {
                toast.error('An error occured');
            }
        } else {
            toast.error('This shape cannot be colored');
        }

    }, [toolSelected, allShapesKeeped]);

    const validateSvg: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (hasSelectedShapes) {
            if (svgCode !== null) {
                fetch(`/api/flag/country/${country_code}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ svg: svgCode.svg })
                })
                .then(response => response.json())
                .then(data => {
                    toast.success(data.message);
                })
                .catch(error => {
                    toast.error('An error occured');
                    console.error(error);
                });
            }
        } else {
            toast.error('Please select at least one shape before sending');
        }
    }

    return (
        <>
            { alreadyTreated && (
                <Alert hasIcon type='warning' duration={3000}>
                    <p>This flag seems to be already treated.</p>
                </Alert>
            ) }
            <div ref={svgCodeContainer} className='hidden' dangerouslySetInnerHTML={{ __html : svgCode?.svg || "" }}></div>
            <h1 className='absolute top-3 text-3xl text-slate-600 font-bold'>{countryName}</h1>
            <div className='w-full h-full flex flex-col items-center justify-start gap-12'>
                <div className='w-full flex flex-row items-center justify-center mt-16 gap-12'>
                    <CopyButton stringToCopy={svgCode?.svg || ""} />
                    <div id={styles.codeRenderer} className='w-4/5'>
                        <SyntaxHighlighter wrapLongLines customStyle={{maxHeight: "400px", maxWidth: "1100px"}} style={theme} showLineNumbers={true} language="xml">
                            {svgCode?.svg || "loading..."}
                        </SyntaxHighlighter>
                    </div>
                </div>
                <div className='absolute left-10 bottom-10 w-fit flex flex-col items-start justify-center gap-3'>
                    <ul className='flex flex-row gap-3 items-center justify-start'>
                        {tools.map((button) => (
                                <Tooltip disabled={ allShapesKeeped } key={button.key} text={uppercaseFirstWordsLetters(button.key)}>
                                    <SelectableColorCircle onClick={e => onSelect(e, button)} disabled={ allShapesKeeped } color={`url(${button.texture})`} />
                                </Tooltip>
                            )
                        )}
                    </ul>
                    <div className='flex flex-row gap-3 items-center'>
                        <Checkbox 
                            checked={allShapesKeeped}
                            label='Keep all shapes'
                            onChange={(e) => setAllShapesKeeped(e.currentTarget.checked)}
                        />
                        <Tooltip text={ cleared ? 'Cleared' : 'Clear all'}>
                            <Button onMouseLeave={(e) => (setCleared(false))} onClick={clearAll} customs={{paddingClass: "p-2"}}>
                                <CiEraser className='w-6 h-6' />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <ButtonGoBackOrNext 
                            dataSource={countries.map(country => ({ value: country.code}))} 
                            currentValue={ country_code } 
                            url={ `/dev/verify/country` }
                            direction={Direction.BACK} 
                            cannotLoop={true}
                        />
                        <ButtonGoBackOrNext 
                            dataSource={countries.map(country => ({ value: country.code}))} 
                            currentValue={ country_code } 
                            url={ `/dev/verify/country` }
                            cannotLoop={true}
                        />
                    </div>
                </div>
                <ColorableFlag 
                    className='flex flex-col items-end justify-center absolute bottom-10 right-10'
                    sourceElement={ countryElement } 
                    itemName='country' 
                    canValidate={ false } 
                    devMode={ true }
                    onChangeSvg={setSvgCode}
                    onClickOnShape={onClickOnShape}
                    colorableShapesSetter={setColorableShapes}
                    toolSelected={toolSelected}
                >
                    <Tooltip disabled={hasSelectedShapes} text='Select at least one shape before sending' type='error' hasIcon={true} position='left' className='mt-2'>
                        <Button disabled={!hasSelectedShapes} className='gap-2' onClick={validateSvg}>
                            <p>Send</p>
                            <IoSendSharp />
                        </Button>
                    </Tooltip>
                </ColorableFlag>
                { initialPaintbrushPosition !== null && <PaintbrushMouse initialPosition={initialPaintbrushPosition} color={`url(#${toolSelected?.mouseBackground})`} /> }
            </div>
        </>
    );
};

export default VerifyCountries;