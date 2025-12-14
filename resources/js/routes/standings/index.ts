import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/standings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StandingsController::index
 * @see app/Http/Controllers/StandingsController.php:13
 * @route '/standings'
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
const standings = {
    index: Object.assign(index, index),
}

export default standings