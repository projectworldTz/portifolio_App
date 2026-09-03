<?php

namespace App\Models;

use App\Enums\PublishStatus;
use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, HasSlug;

    protected string $slugSource = 'title';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'short_description',
        'description',
        'features',
        'challenges',
        'solutions',
        'thumbnail',
        'demo_url',
        'demo_email',
        'demo_password',
        'repo_url',
        'demo_video_url',
        'price',
        'is_purchasable',
        'is_featured',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'price' => 'decimal:2',
            'is_purchasable' => 'boolean',
            'is_featured' => 'boolean',
            'status' => PublishStatus::class,
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technology');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
