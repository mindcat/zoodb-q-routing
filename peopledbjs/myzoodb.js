import fs from 'fs';
import path from 'path';

import loMerge from 'lodash/merge.js';


import { ZooDb, ZooDbDataLoaderHandler } from '@phfaist/zoodb';

import { use_relations_populator } from '@phfaist/zoodb/std/use_relations_populator';
import { use_gitlastmodified_processor } from '@phfaist/zoodb/std/use_gitlastmodified_processor';
import { use_flm_environment } from '@phfaist/zoodb/std/use_flm_environment';
import { use_flm_processor } from '@phfaist/zoodb/std/use_flm_processor';
import { use_searchable_text_processor } from '@phfaist/zoodb/std/use_searchable_text_processor';

import { makeStandardZooDb } from '@phfaist/zoodb/std/stdzoodb';
import { makeStandardYamlDbDataLoader } from '@phfaist/zoodb/std/stdyamldbdataloader';


// Use __dirname. *Requires Node >= 20.11 / 21.2* .
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const example_root_dir = path.resolve(__dirname, '..');


// -------------------------------------

const csl_filename = path.join(__dirname, 'american-physical-society-et-al--patched.csl');

// -----------------------------------------------------------------------------

// import the permalinks
import { permalinks } from './permalinks.js';

// -----------------------------------------------------------------------------

export class MyZooDb extends ZooDb
{
    constructor(config)
    {
        super(config);
    }

    // You can add custom validation logic here later for your routing nodes
    async validate()
    {
        super.validate();
    }
}

export async function createMyZooDb(config = {}, { data_dir, schema_root }={})
{
    schema_root ??= example_root_dir;
    data_dir ??= path.join(example_root_dir, 'data');

    config = loMerge(
        {
            ZooDbClass: MyZooDb,

            fs: fs,
            fs_data_dir: data_dir,

            use_relations_populator,
            use_gitlastmodified_processor,
            use_flm_environment,
            use_flm_processor,
            use_searchable_text_processor,

            flm_options: {
                refs:  {
                    // Changed from person to node
                    node: {
                        formatted_ref_flm_text_fn: (node_id, node) => node.name,
                    },
                },

                citations: {
                    csl_style: fs.readFileSync( csl_filename, { encoding: 'utf-8', }, ),
                    override_arxiv_dois_file: 'citations_info/override_arxiv_dois.yml',
                    preset_bibliography_files: [ 'citations_info/bib_preset.yml', ],
                    default_user_agent: null,
                },

                resources: {
                    rename_figure_template: null,
                    figure_filename_extensions: null,
                    graphics_resources_fs_data_dir: null,

                    graphics_use_srcset_parceljs: {
                        enabled: true,
                        image_max_zoom_factor: 2,
                    }
                },

                environment_options: { }

            },

            searchable_text_options: {
                object_types: ['node',]  // which DB object types to search
            },

            zoo_permalinks: permalinks,

            // specify where to find schemas
            schemas: {
                schema_root: schema_root,
                schema_rel_path: 'schemas/',
                schema_add_extension: '.yml',
            },

        },
        config
    );

    return await makeStandardZooDb(config);
}


// -----------------------------------------------------------------------------

export async function createMyYamlDbDataLoader(zoodb)
{
    let config = {
        // specify objects & where to find them
        objects: {
            node: {
                schema_name: 'node',
                data_src_path: 'nodes/', // Changed folder from people/ to nodes/
            },
        },
    }

    return await makeStandardYamlDbDataLoader(zoodb, config);
}


// -----------------------------------------------------------------------------

export async function load_zoodb(options)
{
    const zoodb = await createMyZooDb(null, options);
    const loader = await createMyYamlDbDataLoader(zoodb);

    const loader_handler = new ZooDbDataLoaderHandler(
        loader,
        {
            throw_reload_errors: false, // for when in devel mode with eleventy
        }
    );
    await zoodb.install_zoo_loader_handler(loader_handler);

    await zoodb.load();

    return zoodb;
}
