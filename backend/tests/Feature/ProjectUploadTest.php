<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_project_with_images(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->post('/api/projects', [
            'title' => 'Upload Test Project',
            'short_description' => 'A project used to verify image uploads.',
            'description' => 'Full project description.',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => true,
            'is_purchasable' => false,
            'thumbnail' => UploadedFile::fake()->image('thumbnail.jpg', 1200, 750),
            'images' => [
                ['file' => UploadedFile::fake()->image('screen.jpg', 1200, 750), 'alt_text' => 'Project screen'],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('title', 'Upload Test Project')
            ->assertJsonCount(1, 'images');

        $this->assertDatabaseHas('projects', ['slug' => 'upload-test-project']);
        $this->assertDatabaseCount('project_images', 1);
    }
}
