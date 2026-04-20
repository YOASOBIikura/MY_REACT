import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import fs from 'fs';

const packages = [
    {
        name: 'react',
        input: 'packages/react/index.ts',
        output: [
            {
                file: './dist/react/index.js',
                format: 'umd',
                name: 'react'
            }
        ],
        packageJson: {
            "name": "react",
            "version": "1.0.0",
            "main": "index.js"
        }
    },
    {
        name: 'jsx-runtime',
        input: 'packages/react/jsx-runtime.ts',
        output: [
            {
                file: './dist/react/jsx-runtime.js',
                format: 'umd',
                name: 'jsx-runtime'
            },
            {
                file: './dist/react/jsx-dev-runtime.js',
                format: 'umd',
                name: 'jsx-dev-runtime'
            }
        ]
    },
    {
        name: 'react',
        input: 'packages/react-dom/client.ts',
        output: [
            {
                file: './dist/react-dom/client.js',
                format: 'umd',
                name: 'react-dom'
            }
        ],
        packageJson: {
            "name": "react-dom",
            "version": "1.0.0",
            "main": "client.js"
        } 
    },
]

async function build(){
    for(const pkg of packages){
        const config = {
            input: pkg.input,
            plugins: [
                babel({
                    presets: ['@babel/preset-env'],
                }),
                typescript({
                    tsconfig: './tsconfig.json',
                    exclude: ['**/*.test.ts'],
                    declaration: true,
                    declarationDir:path.dirname(pkg.output[0].file),
                })
            ]
        }

        const bundle = await rollup(config);
        for(const output of pkg.output){
            await bundle.write(output);
        }
        if(pkg.packageJson){
            const reactDir = path.join('dist', pkg.packageJson.name);
            if(!fs.existsSync(reactDir)){
                fs.mkdirSync(reactDir, {recursive:true});
            }
            fs.writeFileSync(path.join(reactDir, 'package.json'), JSON.stringify(pkg.packageJson, null, 2));
        }
    }

    
    
}

build();


