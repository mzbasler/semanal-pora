import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/matches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FootballMatchController::index
 * @see app/Http/Controllers/FootballMatchController.php:17
 * @route '/matches'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/matches/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FootballMatchController::create
 * @see app/Http/Controllers/FootballMatchController.php:48
 * @route '/matches/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\FootballMatchController::store
 * @see app/Http/Controllers/FootballMatchController.php:59
 * @route '/matches'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matches',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FootballMatchController::store
 * @see app/Http/Controllers/FootballMatchController.php:59
 * @route '/matches'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::store
 * @see app/Http/Controllers/FootballMatchController.php:59
 * @route '/matches'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::store
 * @see app/Http/Controllers/FootballMatchController.php:59
 * @route '/matches'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::store
 * @see app/Http/Controllers/FootballMatchController.php:59
 * @route '/matches'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
export const show = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/matches/{match}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
show.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return show.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
show.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
show.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
    const showForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
        showForm.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FootballMatchController::show
 * @see app/Http/Controllers/FootballMatchController.php:82
 * @route '/matches/{match}'
 */
        showForm.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\FootballMatchController::confirm
 * @see app/Http/Controllers/FootballMatchController.php:112
 * @route '/matches/{match}/confirm'
 */
export const confirm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/matches/{match}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FootballMatchController::confirm
 * @see app/Http/Controllers/FootballMatchController.php:112
 * @route '/matches/{match}/confirm'
 */
confirm.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return confirm.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::confirm
 * @see app/Http/Controllers/FootballMatchController.php:112
 * @route '/matches/{match}/confirm'
 */
confirm.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::confirm
 * @see app/Http/Controllers/FootballMatchController.php:112
 * @route '/matches/{match}/confirm'
 */
    const confirmForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::confirm
 * @see app/Http/Controllers/FootballMatchController.php:112
 * @route '/matches/{match}/confirm'
 */
        confirmForm.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(args, options),
            method: 'post',
        })
    
    confirm.form = confirmForm
/**
* @see \App\Http\Controllers\FootballMatchController::togglePlayerConfirmation
 * @see app/Http/Controllers/FootballMatchController.php:167
 * @route '/matches/{match}/toggle-confirmation'
 */
export const togglePlayerConfirmation = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePlayerConfirmation.url(args, options),
    method: 'post',
})

togglePlayerConfirmation.definition = {
    methods: ["post"],
    url: '/matches/{match}/toggle-confirmation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FootballMatchController::togglePlayerConfirmation
 * @see app/Http/Controllers/FootballMatchController.php:167
 * @route '/matches/{match}/toggle-confirmation'
 */
togglePlayerConfirmation.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return togglePlayerConfirmation.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::togglePlayerConfirmation
 * @see app/Http/Controllers/FootballMatchController.php:167
 * @route '/matches/{match}/toggle-confirmation'
 */
togglePlayerConfirmation.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePlayerConfirmation.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::togglePlayerConfirmation
 * @see app/Http/Controllers/FootballMatchController.php:167
 * @route '/matches/{match}/toggle-confirmation'
 */
    const togglePlayerConfirmationForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: togglePlayerConfirmation.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::togglePlayerConfirmation
 * @see app/Http/Controllers/FootballMatchController.php:167
 * @route '/matches/{match}/toggle-confirmation'
 */
        togglePlayerConfirmationForm.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: togglePlayerConfirmation.url(args, options),
            method: 'post',
        })
    
    togglePlayerConfirmation.form = togglePlayerConfirmationForm
/**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
export const assignTeamsPage = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignTeamsPage.url(args, options),
    method: 'get',
})

assignTeamsPage.definition = {
    methods: ["get","head"],
    url: '/matches/{match}/assign-teams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
assignTeamsPage.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return assignTeamsPage.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
assignTeamsPage.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignTeamsPage.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
assignTeamsPage.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assignTeamsPage.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
    const assignTeamsPageForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: assignTeamsPage.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
        assignTeamsPageForm.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignTeamsPage.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FootballMatchController::assignTeamsPage
 * @see app/Http/Controllers/FootballMatchController.php:222
 * @route '/matches/{match}/assign-teams'
 */
        assignTeamsPageForm.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignTeamsPage.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    assignTeamsPage.form = assignTeamsPageForm
/**
* @see \App\Http\Controllers\FootballMatchController::assignTeams
 * @see app/Http/Controllers/FootballMatchController.php:253
 * @route '/matches/{match}/assign-teams'
 */
export const assignTeams = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignTeams.url(args, options),
    method: 'post',
})

assignTeams.definition = {
    methods: ["post"],
    url: '/matches/{match}/assign-teams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FootballMatchController::assignTeams
 * @see app/Http/Controllers/FootballMatchController.php:253
 * @route '/matches/{match}/assign-teams'
 */
assignTeams.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return assignTeams.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::assignTeams
 * @see app/Http/Controllers/FootballMatchController.php:253
 * @route '/matches/{match}/assign-teams'
 */
assignTeams.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignTeams.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::assignTeams
 * @see app/Http/Controllers/FootballMatchController.php:253
 * @route '/matches/{match}/assign-teams'
 */
    const assignTeamsForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignTeams.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::assignTeams
 * @see app/Http/Controllers/FootballMatchController.php:253
 * @route '/matches/{match}/assign-teams'
 */
        assignTeamsForm.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignTeams.url(args, options),
            method: 'post',
        })
    
    assignTeams.form = assignTeamsForm
/**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
export const lineup = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lineup.url(args, options),
    method: 'get',
})

lineup.definition = {
    methods: ["get","head"],
    url: '/matches/{match}/lineup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
lineup.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return lineup.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
lineup.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lineup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
lineup.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lineup.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
    const lineupForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lineup.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
        lineupForm.get = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lineup.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FootballMatchController::lineup
 * @see app/Http/Controllers/FootballMatchController.php:292
 * @route '/matches/{match}/lineup'
 */
        lineupForm.head = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lineup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lineup.form = lineupForm
/**
* @see \App\Http\Controllers\FootballMatchController::updateStats
 * @see app/Http/Controllers/FootballMatchController.php:306
 * @route '/matches/{match}/update-stats'
 */
export const updateStats = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStats.url(args, options),
    method: 'post',
})

updateStats.definition = {
    methods: ["post"],
    url: '/matches/{match}/update-stats',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FootballMatchController::updateStats
 * @see app/Http/Controllers/FootballMatchController.php:306
 * @route '/matches/{match}/update-stats'
 */
updateStats.url = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { match: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { match: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    match: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        match: typeof args.match === 'object'
                ? args.match.id
                : args.match,
                }

    return updateStats.definition.url
            .replace('{match}', parsedArgs.match.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FootballMatchController::updateStats
 * @see app/Http/Controllers/FootballMatchController.php:306
 * @route '/matches/{match}/update-stats'
 */
updateStats.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStats.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FootballMatchController::updateStats
 * @see app/Http/Controllers/FootballMatchController.php:306
 * @route '/matches/{match}/update-stats'
 */
    const updateStatsForm = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStats.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FootballMatchController::updateStats
 * @see app/Http/Controllers/FootballMatchController.php:306
 * @route '/matches/{match}/update-stats'
 */
        updateStatsForm.post = (args: { match: number | { id: number } } | [match: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStats.url(args, options),
            method: 'post',
        })
    
    updateStats.form = updateStatsForm
const FootballMatchController = { index, create, store, show, confirm, togglePlayerConfirmation, assignTeamsPage, assignTeams, lineup, updateStats }

export default FootballMatchController